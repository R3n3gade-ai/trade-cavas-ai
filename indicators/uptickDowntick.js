/**
 * Uptick-Downtick Indicator for Highcharts Stock
 * 
 * This indicator tracks the direction of price movements (upticks vs downticks)
 * and creates a cumulative line showing the trend.
 */

// Make sure Highcharts is loaded
(function(H) {
    // Define the custom uptick-downtick indicator
    H.seriesType(
        'uptickdowntick', // Name of the indicator
        'sma', // Parent indicator (Simple Moving Average)
        {
            // Default options
            name: 'Uptick-Downtick',
            lineWidth: 2,
            lineColor: '#f28f43',
            tooltip: {
                valueDecimals: 0
            },
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
                    
                    // If we have enough data points for the period, calculate the average
                    if (i >= period) {
                        uptickDowntickValue = sum;
                        
                        // Store the result
                        uptickDowntickData.push([xData[i], uptickDowntickValue]);
                        uptickDowntickX.push(xData[i]);
                        uptickDowntickY.push(uptickDowntickValue);
                        
                        // Remove oldest value from sum
                        const oldestIdx = i - period + 1;
                        if (oldestIdx > 0) {
                            const oldCurrent = yData[oldestIdx][closeIdx] !== undefined ? yData[oldestIdx][closeIdx] : yData[oldestIdx];
                            const oldPrevious = yData[oldestIdx-1][closeIdx] !== undefined ? yData[oldestIdx-1][closeIdx] : yData[oldestIdx-1];
                            const oldTick = oldCurrent > oldPrevious ? 1 : (oldCurrent < oldPrevious ? -1 : 0);
                            sum -= oldTick;
                        }
                    }
                }
                
                return {
                    values: uptickDowntickData,
                    xData: uptickDowntickX,
                    yData: uptickDowntickY
                };
            }
        }
    );
}(Highcharts));
