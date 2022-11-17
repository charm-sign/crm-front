<template>
  <div class="app-container">
    <el-card>正式客户管理 </el-card>
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
        <el-form-item label="状态">
          <el-select v-model="customerQuery.status" placeholder="正式客户">
            <!-- 查询出来的 -->
            <el-option label="正式客户" value="1"></el-option>
            <el-option label="全部"></el-option>
            <el-option label="流失" value="-2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="getList()"
            icon="el-icon-search"
            plain
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
        <el-table-column
          prop="name"
          label="姓名"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column prop="age" label="年龄" width="100" align="center">
        </el-table-column>

        <el-table-column label="性别" width="100" align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.gender == 1">男</a>
            <a v-if="scope.row.gender == 0">女</a>
          </template>
        </el-table-column>

        <el-table-column
          prop="tel"
          label="电话"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="qq"
          label="QQ"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="jobs"
          label="职业"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sources"
          label="来源"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sellers"
          label="营销人员"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <a v-if="scope.row.status == -2">流失</a>
            <a v-if="scope.row.status == -1">开发失败</a>
            <a v-if="scope.row.status == 0">潜在客户</a>
            <a v-if="scope.row.status == 1">正式客户</a>
            <a v-if="scope.row.status == 2">资源池客户</a>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button @click="getInfo(scope.row.id)" type="text" size="small"
              >编辑</el-button
            >
            <el-button @click="getInfo2(scope.row.id)" type="text" size="small"
              >跟进</el-button
            >
            <el-button @click="getInfo3(scope.row.id)" type="text" size="small"
              >移交</el-button
            >
            <el-button
              @click="updateStatus(scope.row.id)"
              type="text"
              size="small"
              >修改状态</el-button
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
        align="right"
      >
      </el-pagination>
      <!-- 模态窗口 -->
      <!-- 新增，编辑 -->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="customerForm" :rules="rules" ref="customerForm">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="customerForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
            <el-input-number
              v-model="customerForm.age"
              autocomplete="off"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="性别"
            :label-width="formLabelWidth"
            prop="gender"
          >
            <el-select v-model="customerForm.gender" placeholder="">
              <el-option
                v-for="gender in genderList"
                :label="gender.title"
                :value="gender.sequence"
                :key="gender.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="tel">
            <el-input v-model="customerForm.tel" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="QQ" :label-width="formLabelWidth">
            <el-input v-model="customerForm.qq" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="职业" :label-width="formLabelWidth" prop="job">
            <el-select v-model="customerForm.job" placeholder="">
              <el-option
                v-for="job in jobList"
                :label="job.title"
                :value="job.id"
                :key="job.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="来源"
            :label-width="formLabelWidth"
            prop="source"
          >
            <el-select v-model="customerForm.source" placeholder="">
              <el-option
                v-for="source in sourceList"
                :label="source.title"
                :value="source.id"
                :key="source.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateCustomer('customerForm')"
            >提 交</el-button
          >
        </div>
      </el-dialog>

      <!-- 修改客户状态 -->
      <el-dialog :title="title" :visible.sync="dialogUpdateStatus" width="30%">
        <el-form :model="customerForm">
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input
              v-model="customerForm.name"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-select v-model="customerForm.status" placeholder="">
              <el-option
                v-for="status in statusList"
                :label="status.title"
                :value="status.sequence"
                :key="status.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateStatus = false">取 消</el-button>
          <el-button type="primary" @click="updateCustomer()">提 交</el-button>
        </div>
      </el-dialog>
      <!-- 跟进记录 -->
      <el-dialog title="跟进记录" :visible.sync="dialogFollow" width="30%">
        <el-form :model="followUpForm" :rules="followUpRules" ref="followUpForm">
          <el-form-item label="客户姓名" :label-width="formLabelWidth">
            <el-input
              v-model="customerForm.name"
              autocomplete="off"
              :value="customerForm.id"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="跟进时间" :label-width="formLabelWidth" prop="traceTime">
            <el-date-picker
              v-model="followUpForm.traceTime"
              type="datetime"
              placeholder="选择跟进时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="跟进内容" :label-width="formLabelWidth" prop="traceDetails">
            <el-input
              type="textarea"
              v-model="followUpForm.traceDetails"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="跟进方式" :label-width="formLabelWidth" prop="traceType">
            <el-select v-model="followUpForm.traceType" placeholder="">
              <el-option
                v-for="method in traceMethod"
                :label="method.title"
                :value="method.id"
                :key="method.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跟进效果" :label-width="formLabelWidth" prop="traceResult">
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

          <el-form-item label="跟进类型" :label-width="formLabelWidth" prop="type">
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
          <el-button type="primary" @click="saveFollowUp('followUpForm')">提 交</el-button>
        </div>
      </el-dialog>
      <!-- 移交记录 -->

      <el-dialog title="移交" :visible.sync="dialogHandover" width="30%">
        <el-form :model="handoverForm" :rules="handoverRules" ref="handoverForm">
          <el-form-item label="客户姓名" :label-width="formLabelWidth">
            <el-input
              v-model="customerForm.name"
              autocomplete="off"
              :value="customerForm.id"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="旧营销人员" :label-width="formLabelWidth">
            <el-select
              v-model="handoverForm.oldSeller"
              placeholder=""
              :disabled="true"
            >
              <el-option
                v-for="employee in emploeeList"
                :label="employee.name"
                :value="employee.id"
                :key="employee.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新营销人员" :label-width="formLabelWidth" prop="newSeller">
            <el-select v-model="handoverForm.newSeller" placeholder="">
              <el-option
                v-for="employee in emploeeList"
                :label="employee.name"
                :value="employee.id"
                :key="employee.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移交原因" :label-width="formLabelWidth" prop="transReason">
            <el-input
              type="textarea"
              v-model="handoverForm.transReason"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogHandover = false">取 消</el-button>
          <el-button type="primary" @click="saveHandover('handoverForm')">提 交</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import dictApi from "@/api/system/dictionary";
import custApi from "@/api/customer/customer";

import followUpApi from "@/api/customer/followHistory";
import employeeApi from "@/api/system/employee";
import handoverApi from "@/api/customer/handoverHistory";
export default {
  data() {
    var checkphone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!this.isCellPhone(value)) {
        // 引入methods中封装的检查手机格式的方法
        callback(new Error("请输入正确的手机号!"));
      } else {
        callback();
      }
    };
    return {
      //状态下拉框列表
      statusList: null,
      //查询条件
      customerQuery: {
        name: "",
        status: "1", //默认查询状态
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
      dialogUpdateStatus: false,
      dialogFollow: false,
      dialogHandover:false,
      // form: {
      //   name: "",
      //   region: "",
      //   date1: "",
      //   date2: "",
      //   delivery: false,
      //   type: [],
      //   resource: "",
      //   desc: "",
      // },
      formLabelWidth: "120px",
      //编辑表单
      rules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        age: [{ required: true, message: "请输入客户年龄" }],
        gender: [{ required: true, message: "请选择客户性别" }],
        tel: [{ required: true, validator: checkphone, trigger: "blur" }],
        job: [{ required: true, message: "请选择客户职业" }],
        source: [{ required: true, message: "请选择客户来源" }],
      },
       // 跟进表单验证
      followUpRules: {
        traceTime: [
          {
            required: true,
            message: "请选择跟进时间",
            trigger: "change",
          },
        ],
        traceDetails: [{ required: true, message: "请填写跟进内容" }],
        traceType: [
          { required: true, message: "请选择跟进方式", trigger: "change" },
        ],
        traceResult: [{ required: true, message: "请选择跟进效果" }],
        type: [{ required: true, message: "请选择跟进类型" }],
      },
      //移交表单验证
      handoverRules: {
        transReason: [
          { required: true, message: "请填写移交原因", trigger: "blur" },
        ],
        newSeller: [
          { required: true, message: "请选择新营销人员", trigger: "change" },
        ],
      },
      //新增及修改表单
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
      //跟进表单
      followUpForm: {
        customerId: "",
        name: "",
        traceTime: "",
        traceDetails: "",
        traceType: "",
        traceResult: null,
        comment: "",
        type: null,
      },
      handoverForm: {
        id: "",
        customerId: "",
        oldSeller: "",
        newSeller: "",
        transReason: "",
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    //手机号校验
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    },
    init() {
      this.getList();
      this.getAllDict();
      this.getEmployee();
    },
    //查询所有员工
    getEmployee() {
      employeeApi.getEmployee().then((response) => {
        this.emploeeList = response.data.employeeList;
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
       if (this.$refs.customerForm){
this.$refs.customerForm.resetFields();} 
      custApi.getInfoById(id).then((response) => {
        this.customerForm = response.data.customer;
        this.title = "编辑";
        this.dialogFormVisible = true;
      });
    },
    //修改客户信息
    updateCustomer(customerForm) {
      this.$refs[customerForm].validate((valid) => {
        if (valid) {
          custApi
            .update(this.customerForm)
            .then((response) => {
              this.getList();
              this.dialogFormVisible = false;
              this.dialogUpdateStatus = false;
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
        } else {
          return false;
        }
      });
    },
    //修改状态
    updateStatus(id) {
      custApi.getInfoById(id).then((response) => {
        this.customerForm = response.data.customer;
        this.dialogUpdateStatus = true;
      });
    },
    //点击跟进
    getInfo2(id) {
       if (this.$refs.followUpForm){
this.$refs.followUpForm.resetFields();} 
      this.followUpForm = {};
      custApi.getInfoById(id).then((response) => {
        this.customerForm = response.data.customer;
        this.followUpForm.customerId = this.customerForm.id;
        this.dialogFollow = true;
      });
    },
    //保存跟进历史
    saveFollowUp(followUpForm) {
      this.$refs[followUpForm].validate((valid) => {
          if (valid) {
            followUpApi
        .add(this.followUpForm)
        .then((response) => {
          return this.$message({
            type: "success",
            message: "添加成功!",
          });
        })
        .then((response) => {
          (this.dialogFollow = false), this.getList(); //刷新列表
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "添加失败",
          });
        });
          } else {
         
            return false;
          }
        });

     
    },
    //点击移交
    getInfo3(id) {
       if (this.$refs.handoverForm){
this.$refs.handoverForm.resetFields();} 
      this.handoverForm = {};
      custApi.getInfoById(id).then((response) => {
        this.customerForm = response.data.customer;
        this.handoverForm.oldSeller = this.customerForm.seller;
        this.handoverForm.customerId = this.customerForm.id;
        this.handoverForm.customerId = this.customerForm.id;
        this.dialogHandover = true;
      });
    },
    //移交
    saveHandover(handoverForm) {
      this.$refs[handoverForm].validate((valid) => {
          if (valid) {
      handoverApi
        .add(this.handoverForm)
        .then((response) => {
          return this.$message({
            type: "success",
            message: "移交成功!",
          });
        })
        .then((response) => {
          (this.dialogHandover = false), this.getList(); //刷新列表
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "移交失败",
          });
        });
          } else {
         
            return false;
          }
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