// Highcharts Theme Configuration
// This file contains the global theme settings for Highcharts

const highchartsTheme = {
  // Global colors array used for all series
  colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
  
  // Global chart settings
  chart: {
    backgroundColor: '#0a0a0a', // Dark background
    borderWidth: 0,
    borderRadius: 0,
    plotBackgroundColor: null,
    plotShadow: false,
    plotBorderWidth: 0,
    style: {
      fontFamily: 'Inter, sans-serif'
    }
  },
  
  // Title settings
  title: {
    style: {
      color: '#cccccc',
      font: '16px Inter, sans-serif'
    }
  },
  
  // Subtitle settings
  subtitle: {
    style: {
      color: '#999999',
      font: '12px Inter, sans-serif'
    }
  },
  
  // X axis settings
  xAxis: {
    gridLineWidth: 1,
    gridLineColor: '#181816', // Subtle grid lines
    lineColor: '#333333',
    tickColor: '#333333',
    labels: {
      style: {
        color: '#9d9da2',
        fontWeight: 'normal'
      }
    },
    title: {
      style: {
        color: '#999999',
        font: 'bold 12px Inter, sans-serif'
      }
    }
  },
  
  // Y axis settings
  yAxis: {
    gridLineWidth: 1,
    gridLineColor: '#181816', // Subtle grid lines
    lineColor: '#333333',
    tickColor: '#333333',
    tickWidth: 1,
    labels: {
      style: {
        color: '#9d9da2',
        fontWeight: 'normal'
      }
    },
    title: {
      style: {
        color: '#999999',
        font: 'bold 12px Inter, sans-serif'
      }
    }
  },
  
  // Legend settings
  legend: {
    itemStyle: {
      color: '#cccccc'
    },
    itemHoverStyle: {
      color: '#ffffff'
    },
    itemHiddenStyle: {
      color: '#555555'
    }
  },
  
  // Credits (Highcharts logo)
  credits: {
    enabled: false
  },
  
  // Labels
  labels: {
    style: {
      color: '#cccccc'
    }
  },
  
  // Navigation
  navigation: {
    buttonOptions: {
      symbolStroke: '#dddddd',
      theme: {
        fill: '#222222'
      }
    }
  },
  
  // Scrollbar
  scrollbar: {
    barBackgroundColor: '#464646',
    barBorderRadius: 0,
    barBorderWidth: 0,
    buttonBackgroundColor: '#464646',
    buttonBorderWidth: 0,
    buttonArrowColor: '#cccccc',
    buttonBorderRadius: 0,
    rifleColor: '#cccccc',
    trackBackgroundColor: '#121211',
    trackBorderRadius: 0,
    trackBorderWidth: 1,
    trackBorderColor: '#464646'
  },
  
  // Navigator
  navigator: {
    handles: {
      backgroundColor: '#666666',
      borderColor: '#aaaaaa'
    },
    outlineColor: '#666666',
    maskFill: 'rgba(102, 102, 102, 0.2)',
    series: {
      color: '#4572A7',
      lineColor: '#4572A7'
    },
    xAxis: {
      gridLineColor: '#555555'
    }
  },
  
  // Tooltip
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    style: {
      color: '#cdcdc9'
    },
    borderWidth: 0
  },
  
  // Plot options
  plotOptions: {
    line: {
      dataLabels: {
        color: '#cccccc'
      },
      marker: {
        lineColor: '#333333'
      }
    },
    spline: {
      marker: {
        lineColor: '#333333'
      }
    },
    scatter: {
      marker: {
        lineColor: '#333333'
      }
    },
    candlestick: {
      lineColor: '#ea3d3d',     // Downward candle border color
      color: '#ea3d3d',         // Downward/bearish candle color
      upLineColor: '#51a958',   // Upward candle border color
      upColor: '#51a958'        // Upward/bullish candle color
    },
    column: {
      borderColor: 'transparent',
      borderWidth: 0
    }
  },
  
  // Time settings
  time: {
    useUTC: true
  },
  
  // Range selector
  rangeSelector: {
    buttonTheme: {
      fill: '#333333',
      stroke: '#666666',
      style: {
        color: '#cccccc'
      },
      states: {
        hover: {
          fill: '#444444',
          stroke: '#666666',
          style: {
            color: '#ffffff'
          }
        },
        select: {
          fill: '#444444',
          stroke: '#666666',
          style: {
            color: '#ffffff'
          }
        }
      }
    },
    inputStyle: {
      backgroundColor: '#333333',
      color: '#cccccc'
    },
    labelStyle: {
      color: '#cccccc'
    }
  }
};

export default highchartsTheme;
