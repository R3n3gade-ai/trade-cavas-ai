import React, { useEffect, useRef } from 'react';
import { useTickerStore, TimeInterval, TimeFrame } from '../utils/tickerStore';
import { PolygonService } from '../services/polygonService';
import { POLYGON_CONFIG } from '../config/polygonConfig';
import Highcharts from "highcharts/highstock";
import highchartsTheme from '../config/highchartsTheme';
// Load indicators first
import 'highcharts/indicators/indicators-all';
// Load required modules in the correct order
import 'highcharts/modules/drag-panes';
import 'highcharts/modules/annotations-advanced';
import 'highcharts/modules/price-indicator';
import 'highcharts/modules/full-screen';
import 'highcharts/modules/accessibility';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
// Stock Tools module should be loaded last
import 'highcharts/modules/stock-tools';
// CSS files for the Stock Tools
import 'highcharts/css/stocktools/gui.css';
import 'highcharts/css/annotations/popup.css';
// Custom CSS for dark theme
import '../styles/highcharts-dark.css';

interface StockChartProps {}

const StockChart: React.FC<StockChartProps> = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {
        currentTicker,
        currentInterval,
        currentTimeFrame,
        showUptickDowntick,
        showVolume,
        showGrid,
        candleStyle,
        chartBackgroundColor,
        upCandleColor,
        downCandleColor
    } = useTickerStore();

    // Function to fetch data from Polygon API
    const fetchTickerData = async (ticker: string, interval: TimeInterval, timeFrame: TimeFrame) => {
        try {
            // Calculate date range based on time frame
            // Use current date, not future date
            const now = new Date();
            // Ensure we're using the current date, not a future date
            const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            console.log('Initial dates:', {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                timeFrameType: timeFrame.type,
                timeFrameCount: timeFrame.count
            });

            // Adjust start date based on time frame
            if (timeFrame.type === 'day') {
                // For 1-minute candles on 1-day view, we need to ensure we have enough data
                // Polygon API might have limits on how many data points it returns
                if (interval.timespan === 'minute' && timeFrame.count === 1) {
                    // For 1-day view with minute candles, go back 2 days to ensure we have enough data
                    // This accounts for weekends, holidays, and time zone differences
                    startDate.setDate(startDate.getDate() - 2);
                    console.log('Adjusted for 1min/1day:', startDate.toISOString());
                } else {
                    startDate.setDate(startDate.getDate() - timeFrame.count);
                }
            } else if (timeFrame.type === 'month') {
                startDate.setMonth(startDate.getMonth() - timeFrame.count);
            } else if (timeFrame.type === 'year') {
                startDate.setFullYear(startDate.getFullYear() - timeFrame.count);
            } else if (timeFrame.type === 'ytd') {
                startDate.setMonth(0);
                startDate.setDate(1);
            } else if (timeFrame.type === 'all') {
                // For 'all', go back 5 years as a reasonable default
                startDate.setFullYear(startDate.getFullYear() - 5);
            }

            console.log('Adjusted dates:', {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });

            // Format dates as YYYY-MM-DD
            const from = startDate.toISOString().split('T')[0];
            const to = endDate.toISOString().split('T')[0];

            console.log(`Fetching ${interval.label} candles for ${timeFrame.text} period`);
            console.log(`Date range: ${from} to ${to}`);
            console.log(`Interval: ${interval.multiplier} ${interval.timespan}`);

            // Fetch data from Polygon
            const polygonService = new PolygonService(POLYGON_CONFIG.API_KEY);
            const response = await polygonService.getStockAggregates(
                ticker,
                interval.multiplier,
                interval.timespan,
                from,
                to
            );

            if (response.results && response.results.length > 0) {
                // Transform data to OHLCV format
                return response.results.map(bar => [
                    bar.t, // timestamp
                    bar.o, // open
                    bar.h, // high
                    bar.l, // low
                    bar.c, // close
                    bar.v  // volume
                ]);
            }
            throw new Error('No data available');
        } catch (error) {
            console.error(`Error fetching data for ${ticker}:`, error);
            return null;
        }
    };

    // Define the custom uptick-downtick indicator
    const defineUptickDowntickIndicator = () => {
        // Make sure Highcharts is defined
        if (typeof Highcharts === 'undefined') {
            console.warn('Highcharts not loaded yet, cannot define indicator');
            return false;
        }

        // Define the custom indicator only once
        if (!Highcharts.seriesTypes.uptickdowntick) {
            try {
                Highcharts.seriesType(
                    'uptickdowntick', // Name of the indicator
                    'sma', // Parent indicator (Simple Moving Average)
                    {
                        // Default options
                        name: 'Uptick-Downtick',
                        lineWidth: 3,
                        lineColor: '#f28f43',
                        tooltip: {
                            valueDecimals: 0
                        },
                        showInNavigator: true,
                        enableMouseTracking: true,
                        params: {
                            period: 14 // Default period for smoothing
                        }
                    },
                    {
                        // Custom methods
                        getValues: function(series, params) {
                            const xData = series.xData;
                            const yData = series.yData;
                            const period = params.period;
                            const uptickDowntickData = [];
                            const uptickDowntickX = [];
                            const uptickDowntickY = [];

                            // Need at least 2 points to calculate uptick/downtick
                            if (yData.length < 2) {
                                return {
                                    values: [],
                                    xData: [],
                                    yData: []
                                };
                            }

                            // Calculate uptick/downtick values
                            let sum = 0;
                            let uptickDowntickValue = 0;

                            // For OHLC data, use close price (index 3)
                            // For line data, use the value directly
                            const closeIdx = series.options.type === 'ohlc' ||
                                            series.options.type === 'candlestick' ? 3 : 0;

                            for (let i = 1; i < yData.length; i++) {
                                // Get current and previous close prices
                                const current = yData[i][closeIdx] !== undefined ? yData[i][closeIdx] : yData[i];
                                const previous = yData[i-1][closeIdx] !== undefined ? yData[i-1][closeIdx] : yData[i-1];

                                // Determine if this is an uptick or downtick
                                const tick = current > previous ? 1 : (current < previous ? -1 : 0);

                                // Add to running sum
                                sum += tick;

                                // Store the result
                                uptickDowntickValue = sum;
                                uptickDowntickData.push([xData[i], uptickDowntickValue]);
                                uptickDowntickX.push(xData[i]);
                                uptickDowntickY.push(uptickDowntickValue);
                            }

                            return {
                                values: uptickDowntickData,
                                xData: uptickDowntickX,
                                yData: uptickDowntickY
                            };
                        }
                    }
                );
                console.log('Successfully defined uptick-downtick indicator');
                return true;
            } catch (error) {
                console.error('Error defining uptick-downtick indicator:', error);
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const script = async () => {
            // Try to fetch data from Polygon API
            console.log('Fetching data with:', {
                ticker: currentTicker,
                interval: currentInterval,
                timeFrame: currentTimeFrame
            });

            let data = await fetchTickerData(currentTicker, currentInterval, currentTimeFrame);

            // If no data is available, fall back to demo data
            if (!data) {
                console.log('No data available, falling back to demo data');
                data = await fetch(
                    "https://demo-live-data.highcharts.com/aapl-ohlcv.json"
                ).then(response => response.json());
                console.log('Demo data loaded:', data.length, 'data points');
            } else {
                console.log('Polygon data loaded:', data.length, 'data points');
            }

            // split the data set into ohlc and volume
            const ohlc = [],
                volume = [],
                dataLength = data.length

            let previousCandleClose = 0
            for (let i = 0; i < dataLength; i++) {
                ohlc.push([
                    data[i][0], // the date
                    data[i][1], // open
                    data[i][2], // high
                    data[i][3], // low
                    data[i][4], // close
                ])

                volume.push({
                    x: data[i][0], // the date
                    y: data[i][5], // the volume
                    color: data[i][4] > previousCandleClose ? "#466742" : "#a23f43",
                    labelColor: data[i][4] > previousCandleClose ? "#51a958" : "#ea3d3d",
                })
                previousCandleClose = data[i][4]
            }

            // Make sure Highcharts is properly loaded
            if (typeof Highcharts === 'undefined') {
                console.error('Highcharts is not defined');
                return;
            }

            // Apply the Highcharts theme
            Highcharts.setOptions(highchartsTheme)

            // Define our custom indicator
            defineUptickDowntickIndicator();

            Highcharts.stockChart(containerRef.current, {
                chart: {
                    panning: {
                        enabled: true,
                        type: 'xy'
                    },
                    animation: true,
                    backgroundColor: chartBackgroundColor
                },
                rangeSelector: {
                    enabled: true, // Keep enabled for functionality
                    inputEnabled: false, // Disable the date input boxes
                    buttonEnabled: false, // Disable the buttons completely
                    buttons: [], // Empty array to remove all buttons
                    labelStyle: {
                        display: 'none' // Hide any labels
                    },
                },

                navigator: {
                    enabled: true,
                    height: 15, // Reduced height by half
                    margin: 10,
                    outlineColor: '#666',
                    maskFill: 'rgba(102,102,102,0.2)', // More transparent
                    handles: {
                        backgroundColor: '#666',
                        borderColor: '#AAA'
                    },
                    xAxis: {
                        labels: {
                            enabled: false // Remove date/time labels from navigator
                        },
                        gridLineWidth: 0, // Remove vertical grid lines
                        tickLength: 0 // Remove tick marks
                    },
                    yAxis: {
                        gridLineWidth: 0 // Remove horizontal grid lines
                    }
                },

                navigation: {
                    bindingsClassName: 'highcharts-bindings-container',
                    menuItemStyle: {
                        padding: '0.5em'
                    },
                    menuItemHoverStyle: {
                        background: '#4572A5',
                        color: '#FFFFFF'
                    }
                },

                legend: {
                    enabled: false
                },

                title: {
                    text: "",
                    style: {
                        color: '#FFF'
                    }
                },

                accessibility: {
                    enabled: true,
                    description: 'Stock price chart with volume and technical indicators',
                    announceNewData: {
                        enabled: true
                    },
                    keyboardNavigation: {
                        enabled: true,
                        order: ['series', 'zoom', 'rangeSelector', 'legend', 'chartMenu']
                    }
                },



                xAxis: {
                    gridLineWidth: showGrid ? 1 : 0,
                    crosshair: {
                        snap: false,
                    },
                },

                yAxis: [
                    {
                        // Main price axis
                        height: showVolume ? "70%" : "100%",
                        crosshair: {
                            snap: false,
                        },
                        accessibility: {
                            description: "price",
                        },
                        resize: {
                            enabled: showVolume, // Enable resize only when volume is shown
                            lineColor: 'rgba(102, 102, 102, 0.3)', // Semi-transparent gray
                            lineDashStyle: 'Solid',
                            lineWidth: 1, // Much thinner line
                            cursor: 'ns-resize'
                        },
                        minPadding: 0.05,
                        maxPadding: 0.05,
                        startOnTick: false,
                        endOnTick: false,
                        gridLineWidth: showGrid ? 1 : 0, // Toggle grid lines based on setting

                        labels: {
                            align: 'right',
                            x: -8,
                            style: {
                                color: '#CCC'
                            }
                        }
                    },
                    {
                        // Volume axis
                        top: "70%",
                        height: "30%",
                        accessibility: {
                            description: "volume",
                        },
                        visible: showVolume, // Toggle visibility based on showVolume state
                        labels: {
                            align: 'right',
                            x: -8,
                            style: {
                                color: '#CCC'
                            }
                        },
                        minPadding: 0,
                        maxPadding: 0,
                        gridLineWidth: showGrid ? 1 : 0, // Toggle grid lines based on setting
                    },
                    {
                        // Uptick-Downtick indicator axis (overlay)
                        height: showVolume ? "70%" : "100%",  // Match height with price axis
                        top: "0%",      // Align with price axis
                        lineWidth: 0,    // No visible axis line
                        gridLineWidth: 0, // No grid lines
                        labels: {
                            enabled: false  // No labels
                        },
                        title: {
                            text: null     // No title
                        },
                        visible: true,
                        opposite: false
                    },
                ],

                tooltip: {
                    enabled: false
                },

                series: [
                    {
                        type: "candlestick",
                        id: 'main',
                        name: `${currentTicker} Stock Price`,
                        data: ohlc,
                        dataGrouping: {
                            enabled: true,
                            units: [
                                ['minute', [1, 2, 5, 15, 30]],
                                ['hour', [1, 2, 4]],
                                ['day', [1]],
                                ['week', [1]],
                                ['month', [1]]
                            ]
                        }
                    },
                    ...(showVolume ? [{
                        type: "column",
                        name: "Volume",
                        data: volume,
                        yAxis: 1,
                        borderRadius: 0,
                        groupPadding: 0,
                        pointPadding: 0,
                        dataGrouping: {
                            enabled: true,
                            units: [
                                ['minute', [1, 2, 5, 15, 30]],
                                ['hour', [1, 2, 4]],
                                ['day', [1]],
                                ['week', [1]],
                                ['month', [1]]
                            ]
                        }
                    }] : []),
                    // Add the uptick-downtick indicator conditionally
                    ...(showUptickDowntick ? [{
                        type: 'uptickdowntick',
                        linkedTo: 'main',
                        yAxis: 2, // Use the overlay axis
                        zIndex: 5, // Make sure it's drawn on top
                        name: 'Uptick-Downtick',
                        showInLegend: true,
                        params: {
                            period: 14
                        }
                    }] : [])
                ],
                stockTools: {
                    gui: {
                        enabled: true,
                        buttons: ['indicators', 'separator', 'simpleShapes', 'lines', 'crookedLines', 'measure', 'advanced', 'toggleAnnotations', 'separator', 'verticalLabels', 'flags', 'separator', 'zoomChange', 'fullScreen', 'typeChange', 'separator', 'currentPriceIndicator', 'saveChart'],
                        toolbarClassName: 'highcharts-stocktools-toolbar highcharts-stocktools-toolbar-collapsed',
                        iconsURL: 'https://code.highcharts.com/12.2.0/gfx/stock-icons/'
                    }
                },

                plotOptions: {
                    series: {
                        showInLegend: true,
                        marker: {
                            enabled: false,
                            states: {
                                hover: {
                                    enabled: false,
                                },
                            },
                        },
                        events: {
                            legendItemClick: function() {
                                // Toggle visibility
                                if (this.visible) {
                                    this.hide();
                                } else {
                                    this.show();
                                }
                                return false; // Don't toggle by default
                            }
                        }
                    },
                    // Customize candlestick appearance based on selected style
                    candlestick: {
                        color: downCandleColor, // Downward/bearish candle color
                        upColor: upCandleColor, // Upward/bullish candle color
                        upLineColor: upCandleColor, // Upward candle border color
                        lineColor: downCandleColor, // Downward candle border color
                        ...(candleStyle === 'hollow' && {
                            upColor: 'transparent', // Hollow bullish candles
                            color: downCandleColor, // Filled bearish candles
                            upLineColor: upCandleColor // Border color for hollow candles
                        }),
                        ...(candleStyle === 'colored' && {
                            color: downCandleColor,
                            upColor: upCandleColor,
                            lineColor: downCandleColor,
                            upLineColor: upCandleColor,
                            lineWidth: 2 // Thicker lines for colored style
                        })
                    },
                    // Make sure indicators are properly styled
                    indicators: {
                        zIndex: 2,
                        visible: true
                    },
                    sma: {
                        name: 'SMA (14)',
                        tooltip: {
                            valueDecimals: 2
                        }
                    },
                    ema: {
                        name: 'EMA (14)',
                        tooltip: {
                            valueDecimals: 2
                        }
                    },
                    bb: {
                        name: 'Bollinger Bands (20, 2)',
                        tooltip: {
                            valueDecimals: 2
                        }
                    },
                    macd: {
                        name: 'MACD (12, 26, 9)',
                        tooltip: {
                            valueDecimals: 2
                        }
                    },
                    rsi: {
                        name: 'RSI (14)',
                        tooltip: {
                            valueDecimals: 2
                        }
                    }
                },
            })
        };

        script();



        return () => {
            // Clean up chart when component unmounts
            if (containerRef.current) {
                const chart = Highcharts.charts.find(chart => chart && chart.renderTo === containerRef.current);
                if (chart) {
                    chart.destroy();
                }
            }
        };
    }, [currentTicker, currentInterval, currentTimeFrame, showVolume, showGrid, candleStyle, chartBackgroundColor, upCandleColor, downCandleColor]);

    // Effect to handle toggling the indicator on/off
    useEffect(() => {
        if (!containerRef.current) return;

        try {
            // Make sure Highcharts is defined
            if (typeof Highcharts === 'undefined') {
                console.warn('Highcharts not loaded yet, cannot toggle indicator');
                return;
            }

            const chart = Highcharts.charts.find(
                chart => chart && chart.renderTo === containerRef.current
            );

            if (!chart) {
                console.warn('Chart not found, cannot toggle indicator');
                return;
            }

            // Make sure our custom indicator is defined
            const indicatorDefined = defineUptickDowntickIndicator();
            if (!indicatorDefined && showUptickDowntick) {
                console.warn('Could not define indicator, cannot add to chart');
                return;
            }

            // Find and remove existing indicator
            const existingIndicator = chart.series.find(s => s.options.type === 'uptickdowntick');

            if (existingIndicator && !showUptickDowntick) {
                console.log('Removing uptick-downtick indicator');
                existingIndicator.remove();
            }
            // Add indicator if it doesn't exist and should be shown
            else if (!existingIndicator && showUptickDowntick) {
                console.log('Adding uptick-downtick indicator');
                chart.addSeries({
                    type: 'uptickdowntick',
                    linkedTo: 'main',
                    yAxis: 2, // Use the overlay axis
                    zIndex: 5, // Make sure it's drawn on top
                    name: 'Uptick-Downtick',
                    showInLegend: true,
                    lineWidth: 3,
                    lineColor: '#f28f43',
                    params: {
                        period: 14
                    }
                });
            }
        } catch (error) {
            console.error('Error toggling indicator:', error);
        }
    }, [showUptickDowntick]);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default StockChart;
