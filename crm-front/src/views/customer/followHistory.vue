<template>
  <div class="app-container">
    <el-card>跟进历史</el-card>
    <el-divider></el-divider>

    <!--查询表单-->
    <el-card>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input
          v-model="customerHistoryQuery.name"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="跟进时间">
        <el-date-picker
          v-model="customerHistoryQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="customerHistoryQuery.endTime"
          type="datetime"
          placeholder="选择结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item label="跟进类型">
        <el-select v-model="customerHistoryQuery.type" placeholder="全部">
          <!-- 查询出来的 -->
          <el-option label="全部" value=""></el-option>
          <el-option label="潜在开发计划" value="2"></el-option>
          <el-option label="客户跟进历史" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
         <el-button type="primary" @click="getList()" icon="el-icon-search"  plain>查询</el-button>
       
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="historyList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          <!-- 固定公式 -->
          {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="customerNames" label="姓名" width="100" align="center">
      </el-table-column>
      <el-table-column prop="traceTime" label="跟进日期" width="200" align="center">
      </el-table-column>
      <el-table-column
        prop="traceDetails"
        label="跟进内容"
        show-overflow-tooltip
       align="center">
      </el-table-column>
      <el-table-column prop="traceTypes" label="跟进方式" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column label="跟进结果" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.traceResult == 3">良好</a>
          <a v-if="scope.row.traceResult == 2">一般</a>
          <a v-if="scope.row.traceResult == 1">较差</a>
        </template>
      </el-table-column>
      <el-table-column prop="inputUsers" label="录入人" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="type" label="跟进类型" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.type == 2">潜在开发计划</a>
          <a v-if="scope.row.type == 1">客户跟进历史</a>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button @click="getInfo(scope.row.id)" type="text" 
            >编辑</el-button
          >
        </template>
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
        <!-- 跟进记录 -->
      <el-dialog title="跟进记录" :visible.sync="dialogFollow" width="30%">
        <el-form :model="customerForm">
          <el-form-item label="客户姓名" :label-width="formLabelWidth">
            <el-input
              v-model="followUpForm.customerId"
              autocomplete="off"
              :value="customerForm.id"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="跟进时间" :label-width="formLabelWidth">
            <el-date-picker
              v-model="followUpForm.traceTime"
              type="datetime"
              placeholder="选择跟进时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="跟进内容" :label-width="formLabelWidth">
            <el-input
            type="textarea"
              v-model="followUpForm.traceDetails"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="跟进方式" :label-width="formLabelWidth">
            <el-select v-model="followUpForm.traceType" placeholder="">
              <el-option
                v-for="method in traceMethod"
                :label="method.title"
                :value="method.id"
                :key="method.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跟进效果" :label-width="formLabelWidth">
            <el-select v-model="followUpForm.traceResult" placeholder="">
              <el-option
                v-for="trace in traceResult"
                :label="trace.title"
                :value="trace.sequence"
                :key="trace.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
            type="textarea"
              v-model="followUpForm.comment"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="跟进类型" :label-width="formLabelWidth">
            <el-select v-model="followUpForm.type" placeholder="">
              <el-option
                v-for="type in typeList"
                :label="type.title"
                :value="type.sequence"
                :key="type.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFollow = false">取 消</el-button>
          <el-button type="primary" @click="update()">提 交</el-button>
        </div>
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
import historyApi from "@/api/customer/followHistory";
import dictApi from "@/api/system/dictionary";

export default {
  data() {
    return {
      formLabelWidth: "120px",
      historyList: null,
      //查询条件
      customerHistoryQuery: {
        name: "",
        startTime: null,
        endTime: null,
        type: null,
      },
      //分页数据
      total: 0,
      pageNo: 1,
      pageSize: 10,
      //跟进表单
      followUpForm: {
        id:"",
        customerId: "",
        name: "",
        traceTime: "",
        traceDetails: "",
        traceType: "",
        traceResult: "",
        comment: "",
        type: "",
      },
    //客户表单
      customerForm: {
        name: "",
        age: "",
        gender: "",
        tel: "",
        qq: "",
        job: "",
        source: "",
        status: "",
      },
      multipleSelection: [],
       traceMethod: [],
      typeList: [],
      emploeeList:[],
      dialogFollow:false
    };
  },
  created() {
    this.getList();
    this.getAllDict();
  },
  methods: {
    // 分页条件查询
    getList(pageNo = 1) {
      this.pageNo = pageNo;
      historyApi
        .list(this.pageNo, this.pageSize, this.customerHistoryQuery)
        .then((response) => {
          this.historyList = response.data.customerFollowUpHistoryDetailList;
          this.total = response.data.total;
        });
    },
     //查询所有下拉框数据（字典）
    getAllDict() {
      dictApi.detailList().then((response) => {
        this.dictionaryDetailList = response.data.dictionaryDetailList;
        this.dictionaryDetailList.forEach((item, index) => {
          if (item.sn == "job") {
            this.jobList = item.detailList;
          }
          if (item.sn == "source") {
            this.sourceList = item.detailList;
          }
          if (item.sn == "status") {
            this.statusList = item.detailList;
          }
          if (item.sn == "gender") {
            this.genderList = item.detailList;
          }
          if (item.sn == "Follow-up effect") {
            this.traceResult = item.detailList;
          }
          if (item.sn == "Follow-up method") {
            this.traceMethod = item.detailList;
          }
          if (item.sn == "Follow-up Type") {
            this.typeList = item.detailList;
          }
        });
        // console.log("jobList=");
        // console.log(this.jobList);
      });
    },
//根据id查询客户信息
    getInfo(id) {
      historyApi.getDetailById(id).then(response => { 
       
      this.followUpForm= response.data.customerFollowUpHistory
      })
        this.dialogFollow = true;
    },
    //修改跟进历史信息
    update() {
      
      historyApi
        .update(this.followUpForm)
        .then((response) => {
          this.getList();
          this.dialogFollow = false;
         
        })
        .then((response) => {
          return this.$message({
            type: "success",
            message: "修改成功!",
          });
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "修改失败",
          });
        });
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