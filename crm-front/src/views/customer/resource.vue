<template>
  <div class="app-container">
    <el-card>潜在客户管理</el-card>
    <el-divider></el-divider>

    <!--查询表单-->
    <el-card>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input
          v-model="customerQuery.name"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getList()" icon="el-icon-search" plain
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="customerList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <!-- 固定公式 -->
          {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100" align="center"></el-table-column>
      <el-table-column prop="age" label="年龄" width="80" align="center"> </el-table-column>

      <el-table-column label="性别" width="80" align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.gender == 1">男</a>
          <a v-if="scope.row.gender == 0">女</a>
        </template>
      </el-table-column>

      <el-table-column prop="tel" label="电话" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="qq" label="QQ" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="jobs" label="职业" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="sources" label="来源" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="sellers" label="营销人员" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.status == -2">流失</a>
          <a v-if="scope.row.status == -1">开发失败</a>
          <a v-if="scope.row.status == 0">潜在用户</a>
          <a v-if="scope.row.status == 1">正式用户</a>
          <a v-if="scope.row.status == 2">资源池客户</a>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button @click="getInfo2(scope.row.id)" type="text" 
            >移交给我</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <el-button @click="getInfo(scope.row.id)" type="text"
            >移交</el-button
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
    <!-- 模态窗口 -->

    <!-- 移交 -->
      
      <el-dialog title="移交" :visible.sync="dialogHandover" width="30%">
        <el-form :model="customerForm">
          <el-form-item label="客户姓名" :label-width="formLabelWidth">
            <el-input
              v-model="customerForm.name"
              autocomplete="off"
              :value="customerForm.id"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="旧营销人员" :label-width="formLabelWidth" >
            <el-select v-model="handoverForm.oldSeller" placeholder="" :disabled="true">
              <el-option
                v-for="employee in emploeeList"
                :label="employee.name"
                :value="employee.id"
                :key="employee.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新营销人员" :label-width="formLabelWidth">
            <el-select v-model="handoverForm.newSeller" placeholder="">
              <el-option
                v-for="employee in emploeeList"
                :label="employee.name"
                :value="employee.id"
                :key="employee.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移交原因" :label-width="formLabelWidth">
            <el-input
            type="textarea"
              v-model="handoverForm.transReason"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogHandover = false">取 消</el-button>
          <el-button type="primary" @click="saveHandover()">提 交</el-button>
        </div>
      </el-dialog>

<!-- 移交给我 -->   
      <el-dialog title="移交给我" :visible.sync="dialogHandover2" width="30%">
        <el-form :model="customerForm">
          <el-form-item label="客户姓名" :label-width="formLabelWidth">
            <el-input
              v-model="customerForm.name"
              autocomplete="off"
              :value="customerForm.id"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="旧营销人员" :label-width="formLabelWidth" >
            <el-select v-model="handoverForm.oldSeller" placeholder="" :disabled="true">
              <el-option
                v-for="employee in emploeeList"
                :label="employee.name"
                :value="employee.id"
                :key="employee.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新营销人员" :label-width="formLabelWidth">
            <el-select v-model="handoverForm.newSeller" placeholder="" :disabled="true">
              <el-option
                v-for="employee in emploeeList"
                :label="employee.name"
                :value="employee.id"
                :key="employee.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移交原因" :label-width="formLabelWidth">
            <el-input
            type="textarea"
              v-model="handoverForm.transReason"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogHandover2 = false">取 消</el-button>
          <el-button type="primary" @click="saveHandover()">提 交</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import dictApi from "@/api/system/dictionary";
import custApi from "@/api/customer/customer";

import followUpApi from "@/api/customer/followHistory";
import employeeApi from "@/api/system/employee"
import handoverApi from "@/api/customer/handoverHistory"
import userApi from "@/api/user"
export default {
  data() {
    return {
      //状态下拉框列表
      statusList: null,
      //查询条件
      customerQuery: {
        name: "",
        status: 2,
      },
      customerList: null,
      //分页数据
      pageNo: 1,
      pageSize: 10,
      total: 0,

      multipleSelection: [],
      //模态窗口数据
      currentRow: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHandover: false,
      dialogHandover2:false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",
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
      dictionaryDetailList: [],
      detailList: [],
      jobList: [],
      sourceList: [],
      genderList: [],
      traceResult: [],
      traceMethod: [],
      typeList: [],
      emploeeList: [],
       handoverForm: {
        id:"",
        customerId: "",
        oldSeller: "",
        newSeller: "",
        transReason: "",
      },
    };
  },
 created() {
   this.init()
  },
  methods: {
     init() { 
 this.getList();
    this.getAllDict();
    this.getEmployee();
    },
    //查询所有员工
    getEmployee() { 
      employeeApi.getEmployee().then(response => { 
        this.emploeeList= response.data.employeeList
      })
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

    // 分页条件查询
    getList(pageNo = 1) {
      this.pageNo = pageNo;
      custApi
        .list(this.pageNo, this.pageSize, this.customerQuery)
        .then((response) => {
          this.customerList = response.data.customerList;
          this.total = response.data.total;
        });
    },
    //点击移交
    getInfo(id) {
      this.handoverForm = {};
      custApi.getInfoById(id).then((response) => {
          this.customerForm = response.data.customer;
        this.handoverForm.oldSeller = this.customerForm.seller
        this.handoverForm.customerId = this.customerForm.id;
         this.handoverForm.customerId = this.customerForm.id;
          this.dialogHandover = true;
      });
    },
      //点击移交给我
    getInfo2(id) {
      this.handoverForm = {};
      custApi.getInfoById(id).then((response) => {
        this.customerForm = response.data.customer;
          this.handoverForm.newSeller = response.data.tokenId;
        this.handoverForm.oldSeller = this.customerForm.seller
        this.handoverForm.customerId = this.customerForm.id;
        this.handoverForm.customerId = this.customerForm.id;
         
          this.dialogHandover2 = true;
      })
    
    },
//移交
    saveHandover() { 
      handoverApi.add(this.handoverForm).then(response => {
          return this.$message({
            type: "success",
            message: "移交成功!",
          });
        })
        .then((response) => {
          (this.dialogHandover = false), 
            this.dialogHandover2 = false
          this.getList(); //刷新列表
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "移交失败",
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