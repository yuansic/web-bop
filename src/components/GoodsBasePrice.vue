<template>
  <div class="segment" id="goods-price">
    <div class="segment-header">价格波动</div>
    <div class="segment-area">
      <div
        id="myChart"
        :style="{ width: '100%', height: '350px', overflow: 'hidden auto', margin: '0 auto' }"
      ></div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import echarts from 'echarts';

export default {
  props: {
    goodsPrice: {
      type: Array,
      required: true,
      default: function() {
        return [];
      }
    }
  },
  data: function() {
    return {};
  },
  computed: {},
  watch: {
    // 数据请求异步回来时 才能渲染出线条 所以要监听
    goodsPrice: function(newValue, oldValue) {
      this.setEchartsLine(newValue);
    }
  },
  created() {},
  mounted() {
    // 挂载时 初始化 否则dom找不到
    this.initEcharts();
    window.onresize = () => {
      this.myChart.resize();
    };
  },
  methods: {
    // 初始化折线图
    initEcharts() {
      let myChart = echarts.init(document.getElementById('myChart'), 'dark');

      myChart.setOption({
        backgroundColor: '#ffffff',
        // 提示框样式
        tooltip: {
          formatter: tipData => {
            return `坑口含税价：<span style="color:#ff9900">${tipData.data}</span></br>日期：${
              tipData.name
            }`;
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            show: true,
            interval: 0,
            showMinLabel: false,
            textStyle: {
              color: '#333' //文字颜色
            }
          },
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#333'
            }
          }
        },
        series: [
          {
            name: '坑口含税价',
            type: 'line',
            symbol: 'circle', //折线点设置为实心点
            symbolSize: 8, //折线点的大小
            data: [],
            itemStyle: {
              normal: {
                color: '#ff9900', //折线点的颜色
                lineStyle: {
                  color: '#1890ff' //折线的颜色
                }
              }
            }
          }
        ]
      });
      this.myChart = myChart;
    },
    // 设置线
    setEchartsLine(goodsPriceList) {
      var dataX = [],
        dataY = [];
      goodsPriceList.forEach((element, index) => {
        dataX.push(element.goodsTime);
        dataY.push(element.goodsPrice);
      });

      this.myChart.setOption({
        xAxis: { data: dataX },
        series: [{ data: dataY }]
      });
    }
  }
};
</script>
<style>
</style>
