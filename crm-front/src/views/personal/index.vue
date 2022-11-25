<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div>
        <el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        ></el-avatar>
        
        <el-descriptions
          class="margin-top"
          title="欢迎回来"
          :column="3"
          size="small"
          border
        >
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              用户名
            </template>
            {{ employeeDetail.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              邮箱
            </template>
            {{ employeeDetail.email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-time"></i>
              入职时间
            </template>
            {{ employeeDetail.hireDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              所属部门
            </template>
            <el-tag>{{ employeeDetail.departmentName }}</el-tag>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-set-up"></i>
              角色
            </template>
            <el-tag>{{ employeeDetail.roleNames }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-time"></i>
              上次登录时间
            </template>
            {{ employeeDetail.loginTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <el-divider></el-divider>

    <el-row>
      <el-col :span="12">
        <el-card>
          <!-- 1.容器 注意要设置宽高，否则不显示-->
          <div class="echart" id="mychart" :style="myChartStyle"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          
          <i class="el-icon-s-marketing"><font size="4">我的客户</font></i>
          <br />
          <font size="1">由我负责的客户</font><br />
          <el-divider></el-divider>

          <el-table
    :data="tableData"
    style="width: 100%"
    height="258"
    border
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="name"
      label="姓名"
      width="100"
      align="center">
    </el-table-column>
    <el-table-column
      prop="tel"
      label="电话"
      width="180"
      align="center">
    </el-table-column>
    <el-table-column
      prop="jobs"
      label="职业"
      align="center">
    </el-table-column>
  </el-table>
<br/>
<br/>
<br/>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 2.引入依赖
import * as echarts from "echarts";
import custApi from "@/api/customer/customer";

export default {
  data() {
    return {
      // 3.设置数据
      DataList: [],
      nameList: [],
      employeeDetail: null,
      myChartStyle: { float: "center", width: "85%", height: "400px" }, //图表样式
       tableData: []
    };
  },
  created() {
    this.init();
  },
  //   6.调用
  mounted() {
    setTimeout(() => {
      this.initEcharts();
    }, 200);
  },
  methods: {
    //页面加载即调用，获得图形展示数据
    init() {
      custApi.getAllCustomerStatus().then((response) => {
        this.DataList = response.data.allCustomerStatus;
        this.employeeDetail = response.data.employeeDetail;

        this.DataList.map((x) => {
          if (x.name == "-2") {
            x.name = "流失";
          } else if (x.name == "-1") {
            x.name = "开发失败";
          } else if (x.name == "0") {
            x.name = "潜在客户";
          } else if (x.name == "1") {
            x.name = "正式客户";
          } else if (x.name == "2") {
            x.name = "资源池客户";
          }
        });
        this.nameList = this.DataList.map((x) => {
          return x.name;
        });
      });
      custApi.getCustById().then(response => { 
      this.tableData=  response.data.customerDetailList
      })
    },
    initEcharts() {
      const option = {
        title: {
          text: "客户资源概览",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}",
        },
       
        legend: {
          data: this.nameList,
          left: 150,
          right: 0,
          width: 200, // 单行图例的宽度
        },

        series: [
          {
            type: "funnel",

            left: "20%",
            top: 80,
            width: "70%",
            gap: 2,

            data: this.DataList,
            
          },
        ],
      };

      //   4.获取容器并初始化
      const myChart = echarts.init(document.getElementById("mychart"), null, {
        useDirtyRect: true,
      });
      //   5.设置
      myChart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
     tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
  },

};
</script>

<style>
.my-label {
  background: #e1f3d8;
}

.my-content {
  background: #fde2e2;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
