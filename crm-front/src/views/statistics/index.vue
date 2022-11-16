<template>
  <div class="app-container">
    <el-card>统计分析</el-card>
    <el-divider></el-divider>

    <!--查询表单-->
    <el-card>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="queryForm.name" placeholder="请输入员工姓名"></el-input>
      </el-form-item>
      <el-form-item label="时间段查询">
        <el-date-picker
          v-model="queryForm.startTime"
          type="datetime"
          placeholder="开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="queryForm.endTime"
          type="datetime"
          placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item label="分组类型">
        <el-select v-model="queryForm.type" placeholder="员工">
          <el-option label="员工" value="1"></el-option>
          <el-option label="年" value="2"></el-option>
          <el-option label="月" value="3"></el-option>
          <el-option label="日" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="chart()">柱状图显示</el-button>
        <el-button type="primary" plain @click="chart2()">饼状图显示</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="DataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="name" label="分组类型" width="400">
       
      </el-table-column>
      <el-table-column prop="count" label="潜在客户新增数" width="200">

      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="total,prev, pager, next"
      :current-page="pageNo"
      :page-size="pageSize"
      :total="total"
        @current-change="getList"
    align="right">
    </el-pagination>



    </el-card>
  </div>
</template>

<script>
import custApi from '@/api/customer/customer'
export default {
  data() {
    return {
       // 分页查询数据
      DataList: [
        {
          name: "",
          count:""
        }
      ],
      pageNo: 1,
      pageSize: 10,
      total: 0,
     
      queryForm: {
        name: "",
        startTime: "",
        endTime: "",
        type:"",
      },
     
      multipleSelection: [],
    };
  },
  created() { 
this.getList()
  },
  methods: {
// 分页条件查询
    getList(pageNo = 1) {
      this.pageNo = pageNo;
      custApi
        .statistical(this.pageNo, this.pageSize, this.queryForm)
        .then((response) => {
          this.DataList = response.data.statisticalList;
          this.total = response.data.total;
        });
    },
    //柱状图
    chart() {
  
      this.$router.push({ path: '/statistics/chart', query: {  DataList:this.DataList   } });
},
   //饼图
    chart2() {
  
      this.$router.push({ path: '/statistics/chart2', query: {  DataList:this.DataList   } });
      // this.$router.push({ path: '/statistics/2', query: {  DataList:this.DataList   } });

},
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>