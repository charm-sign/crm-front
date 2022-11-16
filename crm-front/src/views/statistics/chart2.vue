<template>
    <div>
    <el-divider></el-divider>

    <el-card>
    <!-- 1.容器 注意要设置宽高，否则不显示-->
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
      DataList:[],
      myChartStyle: { float: "left", width: "100%", height: "600px" } //图表样式
    };
    },
    created() { 
        this.init()
    },
//   6.调用
  mounted() {
    this.initEcharts();
  },
    methods: {
        //接收传递过来的数据
        init() {
       this.DataList = this.$route.query.DataList
        console.log(this.DataList)
       this.DataList= this.DataList.map(x => {
          return {
          value: x.count,
          name:x.name
        } })
        console.log(this.DataList)

    },
    initEcharts() {
      // 基本柱状图   直接复制官网
      const option = {
        title: {
    text: '饼图展示',
    subtext: '新增潜在用户',
    left: 'center'
  },
        tooltip: {
    trigger: 'item'
        },
   legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      data: this.DataList
     
    }
  ]
};

    //   4.获取容器并初始化
      const myChart = echarts.init(document.getElementById("mychart"), null, {useDirtyRect:true});
    //   5.设置
      myChart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
  }
};
</script>

    