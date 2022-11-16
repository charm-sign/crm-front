<template>
  <div class="app-container">
    <el-card>员工管理</el-card>
    <el-divider></el-divider>
    <el-card>
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input
            v-model="employeeQuery.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="员工部门">
          <el-select v-model="employeeQuery.dept" placeholder="全部">
            <!-- 查询出来的 -->
            <el-option label="" value=""></el-option>
            <el-option
              v-for="dept in deptList"
              :label="dept.name"
              :value="dept.id"
              :key="dept.id"
            ></el-option>
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
          <el-button @click="resetData()">添加</el-button>
          <el-button type="danger" @click="onDelete()">批量删除</el-button>

          <el-button type="primary" @click="onExport()" icon="el-icon-download"
            >导出数据</el-button
          >
          <el-button @click="importWin()">导入数据</el-button>
          <el-button type="primary" plain @click="onTemplate()"
            >导入模板</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 数据列表 -->
      <el-table
        ref="multipleTable"
        :data="employeeDetailList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          property="id"
          type="selection"
          value="id"
          width="55"
          align="center"
          :reserve-selection="true"
        >
          <!-- :reserve-selection="true" 实现分页删除的关键代码，意思是点击下一页后还保留上一页的选项数据 -->
        </el-table-column>

        <el-table-column label="序号" width="70" align="center">
          <template slot-scope="scope">
            <!-- 固定公式 -->
            {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          property="name"
          label="名称"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column prop="email" label="email" width="200" align="center">
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" align="center">
        </el-table-column>
        <el-table-column
          prop="departmentName"
          label="部门"
          width="150"
          align="center"
        >
        </el-table-column>
        <!-- 此处用到group_concat函数 -->
        <el-table-column
          prop="roleNames"
          label="角色"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button @click="getInfo(scope.row.id)" type="text"
              >编辑</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteEmployee(scope.row.id)" type="text"
              >删除</el-button
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

      <el-dialog :title="title" :visible.sync="dialogFormVisible" width="70%">
        <el-form :model="employeeForm">
          <el-form-item label="员工名称" :label-width="formLabelWidth">
            <el-input v-model="employeeForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="员工密码" :label-width="formLabelWidth">
            <el-input
              type="password"
              v-model="employeeForm.password"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="验证密码" :label-width="formLabelWidth">
            <el-input
              type="password"
              v-model="employeeForm.password"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="员工年龄" :label-width="formLabelWidth">
            <el-input-number
              v-model="employeeForm.age"
              autocomplete="off"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="员工email" :label-width="formLabelWidth">
            <el-input
              v-model="employeeForm.email"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="员工部门" :label-width="formLabelWidth">
            <el-select v-model="employeeForm.dept" placeholder="全部">
              <!-- 查询出来的 -->
              <el-option
                v-for="dept in deptList"
                :label="dept.name"
                :value="dept.id"
                :key="dept.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="超级管理员" :label-width="formLabelWidth">
            <el-radio v-model="radio" label="1" value="1">是</el-radio>
            <el-radio v-model="radio" label="0" value="0">否</el-radio>
          </el-form-item>
          <el-form-item
            label="员工角色"
            :label-width="formLabelWidth"
          ></el-form-item>

          <div style="text-align: center">
            <el-transfer
              style="text-align: left; display: inline-block"
              v-model="roleIds"
              :render-content="renderFunc"
              :props="{ key: 'id', label: 'name' }"
              :titles="['角色名称', '角色名称']"
              :button-texts="['移除角色', '加入角色']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}',
              }"
              @change="handleChange"
              :data="roleList"
            >
            </el-transfer>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdateRole()"
            >提 交</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
      <el-upload
          class="upload-demo"
  ref="upload"
  action="http://localhost:8080/sysService/employee/uploadExcel"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :file-list="fileList"
  :auto-upload="false">
  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload()">上传到服务器</el-button>
  <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
</el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="importExcel()"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import employeeApi from "@/api/system/employee";
import deptApi from "@/api/system/department";
import roleApi from "@/api/system/role";
import qs from "qs";
export default {
  data() {
    return {
      // 分页查询数据
      employeeDetailList: null,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      employeeQuery: {}, //查询参数
      radio: "1",
      deptList: null, //部门列表
      //穿梭框
      roleList: [], //所有角色列表

      roleIds: [], //穿梭框右边数据id
      // rolePermissionList: [], //该角色对应的权限列表
      renderFunc(h, option) {
        return (
          //穿梭框里的内容
          <span>{option.name}</span>
        );
      },
      //批量选择自带是所有的数据
      multipleSelection: [],
      //模态窗口
      title: "",
      dialogTableVisible: false,
      dialogFormVisible: false,
      employeeForm: {
        name: "",
        password: "",
        email: "",
        age: "",
        dept: "",
        departmentName: "",
      },
dialogVisible: false,
fileList:[],
formData: null, //上传模板数据

      formLabelWidth: "120px",
      currentRow: null,
    };
  },
  created() {
    this.getList();
    this.getDeptList();
    this.getRoleList();
  },
  methods: {
    // 分页条件查询
    getList(pageNo = 1) {
      this.pageNo = pageNo;
      employeeApi
        .conditionList(this.pageNo, this.pageSize, this.employeeQuery)
        .then((response) => {
          this.employeeDetailList = response.data.employeeDetailList;
          this.total = response.data.total;
        });
    },

    //查询所有部门
    getDeptList() {
      deptApi.lists().then((response) => {
        this.deptList = response.data.lists;
      });
    },
    //删除员工
    deleteEmployee(id) {
      // 提示信息
      this.$confirm("确定删除此员工?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调用删除方法
          employeeApi.delete(id).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功！",
            });
            this.getList();
          });
        })
        .catch((response) => {
          this.message({
            type: "error",
            message: "删除失败",
          });
        });
    },

    //获取角色列表
    getRoleList() {
      roleApi.getRoleList().then((response) => {
        this.roleList = response.data.roleList;
        // this.total = response.data.total;
      });
    },

    //点击添加，先清空表单
    resetData() {
      this.employeeForm = {};
      (this.roleIds = []), (this.title = "新增");
      this.dialogFormVisible = true;
    },
    //添加员工
    saveEmployee() {
      this.roleIds = qs.stringify({ ids: this.roleIds }, { indices: false });
      employeeApi
        .add(this.employeeForm, this.roleIds)
        // console.log(this.permissionIds)
        .then((response) => {
          return this.$message({
            type: "success",
            message: "添加成功!",
          });
        })
        .then((response) => {
          (this.dialogFormVisible = false), this.getList(); //刷新列表
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "保存失败",
          });
        });
    },
    //修改
    //根据id查询角色信息
    getInfo(id) {
      employeeApi.getInfoById(id).then((response) => {
        this.employeeForm = response.data.employee;
        //该角色的权限 (需要的是 ids ['1,'2','3'],但返回的是[{id,name},{id,name},{id,name}])
        this.roleIds = response.data.roleList;
        // console.log(this.rolePermissionList)
        this.roleIds = this.roleIds.map((x) => {
          return x.id;
        });
        //  console.log(this.permissionIds)
        this.title = "编辑";
        this.dialogFormVisible = true;
      });
    },
    //修改角色信息
    updateEmployee() {
      this.roleIds = qs.stringify({ ids: this.roleIds }, { indices: false });
      employeeApi
        .update(this.employeeForm, this.roleIds)
        .then((response) => {
          this.getList();
          this.dialogFormVisible = false;
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
    //判断是新建还是修改
    saveOrUpdateRole() {
      if (!this.employeeForm.id) {
        this.saveEmployee();
      } else {
        this.updateEmployee();
      }
    },
    //1.批量选择
    handleSelectionChange(val) {
      // 会将每次选中的记录放在这个数组中
      this.multipleSelection = val;
      // console.log(this.multipleSelection)
    },
    //2.批量删除
    onDelete() {
      // console.log(this.multipleSelection);
      // 遍历数组，取出其中所有id并组成新数组
      this.multipleSelection = this.multipleSelection.map((x) => {
        return x.id;
      });
      console.log(this.multipleSelection);
      //将数组转换为id=1&id=2&id=3...的形式
      this.multipleSelection = qs.stringify(
        { employeeIds: this.multipleSelection },
        { indices: false }
      );
      console.log(this.multipleSelection);
      if (!this.multipleSelection.length == 0)
        this.$confirm("确定删除选中的所有数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            //调用删除方法
            employeeApi
              .deletedBatch(this.multipleSelection)
              .then((response) => {
                this.$message({
                  type: "success",
                  message: "删除成功！",
                });
                //刷新列表
                this.getList();
              });
          })
          .catch((response) => {
            this.message({
              type: "error",
              message: "删除失败",
            });
          });
    },
    //导出数据
    onExport() {
       // 遍历数组，取出其中所有id并组成新数组
      this.multipleSelection = this.multipleSelection.map((x) => {
        return x.id;
      });
      // console.log(this.multipleSelection);
      //将数组转换为id=1&id=2&id=3...的形式
      this.multipleSelection = qs.stringify(
        { Ids: this.multipleSelection },
        { indices: false }
      );
      // console.log(this.multipleSelection);
         window.location.href='http://localhost:8080/sysService/employee/exportExcel?'+this.multipleSelection
      this.getList()
      // employeeApi.exportExcel(this.multipleSelection).then(response => { })  //异步方式响应回来的是文件流，不便操作
        
    },
    onTemplate() { 
      window.location.href='http://localhost:8080/sysService/employee/downExcel'
    },
    //点击导入，清空文件列表
    importWin() {
      this.fileList=[]
      this.dialogVisible = true
    },
    submitUpload() {
      // 还是请求的action
        this.$refs.upload.submit();
      },
    //导入文件提交
    importExcel(){
       this.dialogVisible = false
                this.getList();
    },
     handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
  },
};
</script>