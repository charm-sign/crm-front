<template>
  <div>
    <el-divider></el-divider>

    <el-card>
      <!-- 1.容器 注意要设置宽高，否则不显示 -->
      <div class="echart" id="mychart" :style="myChartStyle"></div>
    </el-card>
  </div>
</template>

<script>
// 2.引入依赖
import * as echarts from "echarts";

export default {
  // 3.设置数据
  data() {
    return {
      xData: [], //横坐标
      yData: [], //数据
      DataList: [],
      myChartStyle: { float: "left", width: "100%", height: "600px" }, //图表样式
    };
  },
  created() {
    this.init();
  },
  //   6.调用
  mounted() {
    this.initEcharts();
  },
  methods: {
    //接收传递过来的数据
    init() {
      this.DataList = this.$route.query.DataList;
      console.log(this.DataList);
      this.xData = this.DataList.map((x) => {
        return x.name;
      });
      console.log(this.xData);
      this.yData = this.DataList.map((x) => {
        return x.count;
      });
    },
    initEcharts() {
      // 基本柱状图   直接复制官网
      const option = {
        
        title: {
          text: "柱状图展示",
          subtext: "新增潜在用户",
          left: "center",
        },
          xAxis: {
          data: this.xData,
        },
          yAxis: {
           
        },
        series: [
          {
            type: "bar", //形状为柱状图
                data: this.yData,
            
          },
          ],
        
      };
      //   4.获取容器并初始化
      const myChart = echarts.init(document.getElementById("mychart"));
      //   5.设置
      myChart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
};
</script>

