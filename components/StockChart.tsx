import React, { useEffect, useRef } from 'react';
import Highcharts from "highcharts/highstock";
import 'highcharts/modules/stock';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/accessibility';
import 'highcharts/modules/stock-tools';
import 'highcharts/modules/annotations-advanced';
import 'highcharts/modules/price-indicator';
import 'highcharts/indicators/indicators-all';
import 'highcharts/modules/full-screen';
import 'highcharts/css/stocktools/gui.css';
import 'highcharts/css/annotations/popup.css';



interface StockChartProps {
    symbol: string;
    data: [number, number, number, number, number, number][];
    onSymbolChange: (symbol: string) => void;
}

const StockChart: React.FC<StockChartProps> = ({ symbol, data, onSymbolChange }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<Highcharts.StockChart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const options: Highcharts.Options = {
            chart: {
                height: '100%',
                spacing: [10, 10, 10, 10]
            },
            title: {
                text: `${symbol} Stock Price`
            },
            rangeSelector: {
                selected: 1,
                buttons: [{
                    type: 'day',
                    count: 1,
                    text: '1D'
                }, {
                    type: 'week',
                    count: 1,
                    text: '1W'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1M'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3M'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6M'
                }, {
                    type: 'ytd',
                    text: 'YTD'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1Y'
                }, {
                    type: 'all',
                    text: 'All'
                }]
            },
            yAxis: [{
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Price'
                },
                height: '60%',
                lineWidth: 2,
                resize: {
                    enabled: true
                }
            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Volume'
                },
                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 2
            }],
            tooltip: {
                split: true,
                shape: 'rect' as const,
                headerShape: 'callout' as const,
                borderWidth: 0,
                shadow: false,
                positioner: function (width, height, point) {
                    return {
                        x: point.plotX - width / 2,
                        y: point.plotY - height - 10
                    };
                }
            },
            series: [{
                type: 'candlestick',
                name: symbol,
                data: data,
                dataGrouping: {
                    units: [
                        ['week', [1]],
                        ['month', [1, 2, 3, 4, 6]]
                    ]
                }
            }, {
                type: 'column',
                name: 'Volume',
                data: data.map(point => [point[0], point[5]]),
                yAxis: 1,
                dataGrouping: {
                    units: [
                        ['week', [1]],
                        ['month', [1, 2, 3, 4, 6]]
                    ]
                }
            }],
            navigator: {
                enabled: true
            },
            scrollbar: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            stockTools: {
                gui: {
                    enabled: true
                }
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 800
                    },
                    chartOptions: {
                        rangeSelector: {
                            inputEnabled: false
                        }
                    }
                }]
            }
        };

        // Initialize the chart
        chartInstance.current = Highcharts.stockChart(chartRef.current, options);

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [symbol, data]);

    return (
        <div
            ref={chartRef}
            style={{
                height: '100%',
                width: '100%',
                minHeight: '500px'
            }}
        />
    );
};

export default StockChart;