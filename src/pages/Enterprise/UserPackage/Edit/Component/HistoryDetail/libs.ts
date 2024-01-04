export function subString(str: string, len: number) {
  let newLength = 0;
  let newStr = '';
  // eslint-disable-next-line no-control-regex
  const chineseRegex = /[^\x00-\xff]/g;
  let singleChar = '';
  const strLength = str.replace(chineseRegex, '**').length;
  if (strLength > len) {
    for (let i = 0; i < strLength; i++) {
      singleChar = str.charAt(i).toString();
      if (singleChar.match(chineseRegex) !== null) {
        newLength += 2;
      } else {
        newLength += 1;
      }
      if (newLength > len) {
        break;
      }
      newStr += singleChar;
    }

    if (strLength > len) {
      newStr += '...';
    }
  } else {
    newStr = str;
  }
  return newStr;
}

/* 颜色列表 */
export const COLOR_LIST = [
  '#0243B1',
  '#05A75E',
  '#05A796',
  '#06DF75',
  '#A2E018',
  '#0BE6C7',
  '#E691F1',
  '#fb7962',
  '#E7322C',
  '#8560c5',
  '#A806EB',
];

export default function registerTheme(echarts: any) {
  echarts.registerTheme('dianshi', {
    color: COLOR_LIST,
    backgroundColor: '#fff',
    textStyle: {},
    yAxis: {
      splitLine: { show: false },
    },
    title: {
      textStyle: {
        color: '#7b8080',
      },
      subtextStyle: {
        color: '#999999',
      },
    },
    line: {
      itemStyle: {
        normal: {
          borderWidth: '2',
        },
      },
      lineStyle: {
        normal: {
          width: '3',
        },
      },
      symbolSize: '8',
      symbol: 'emptyCircle',
      smooth: false,
    },
    bar: {
      itemStyle: {
        normal: {
          barBorderWidth: 0,
          barBorderColor: '#b3b2b2',
        },
        emphasis: {
          barBorderWidth: 0,
          barBorderColor: '#b3b2b2',
        },
      },
      barMaxWidth: 30,
    },
    pie: {
      itemStyle: {
        normal: {
          borderWidth: 0,
          borderColor: '#b3b2b2',
        },
        emphasis: {
          borderWidth: 0,
          borderColor: '#b3b2b2',
        },
      },
    },
    toolbox: {
      iconStyle: {
        normal: {
          borderColor: '#00110d',
        },
        emphasis: {
          borderColor: '#666666',
        },
      },
    },
    dataZoom: {
      backgroundColor: 'rgba(255,255,255,0)',
      dataBackgroundColor: 'rgba(222,222,222,1)',
      fillerColor: 'rgba(114,230,212,0.25)',
      handleColor: '#cccccc',
      handleSize: '100%',
      textStyle: {
        color: '#999999',
      },
    },
    markPoint: {
      label: {
        normal: {
          textStyle: {
            color: '#ffffff',
          },
        },
        emphasis: {
          textStyle: {
            color: '#ffffff',
          },
        },
      },
    },
  });
}

export const SPLIT_AXIS_TICK_PARAMS = {
  splitLine: {
    lineStyle: {
      color: '#eee',
      type: 'dashed',
    },
  },
  axisLine: {
    show: false,
  },
  axisTick: {
    show: false,
  },
};

export function buildDataZoomParams() {
  return {
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
        filterMode: 'empty',
      },
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        handleIcon:
          'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        filterMode: 'empty',
        bottom: 6,
        height: 15,
      },
    ],
  };
}
