<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
    部门管理</el-card>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="always">
    <el-row>
      <el-button type="primary" @click="resetData">新增</el-button>
    </el-row>

    <el-table
     v-loading="loading"
      ref="singleTable"
      :data="departmentList"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          <!-- 固定公式 -->
          {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        property="name"
        label="部门名称"
        width="450"
       align="center"></el-table-column>
      <el-table-column
        property="sn"
        label="部门编号"
        width="550"
       align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button @click="getInfo(scope.row.id)" type="text" 
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            
            @click="deleteDepartment(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="total"
      layout="total,prev, pager, next"
      :current-page="pageNo"
      :page-size="pageSize"
      :total="total"
      @current-change="getList"
    align="right">
    </el-pagination>

    <!-- 模态窗口 -->

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="departmentForm">
        <el-form-item label="部门名称" :label-width="formLabelWidth">
          <el-input v-model="departmentForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门编号" :label-width="formLabelWidth">
          <el-input v-model="departmentForm.sn" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateDepartment"
          >提 交</el-button
        >
      </div>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
import departApi from "@/api/system/department";
export default {
  data() {
    return {
      title:'',
      // 分页查询数据
      departmentList: null,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      //模态窗口数据
      currentRow: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      departmentForm: {
        name: "",
        sn: "",
      },
      formLabelWidth: "120px",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取部门列表
    getList(pageNo = 1) {
      this.pageNo = pageNo;
      departApi.list(this.pageNo, this.pageSize).then((response) => {
        this.departmentList = response.data.departmentList;
        this.total = response.data.total;
      });
    },
    saveOrUpdateDepartment() {
      if (!this.departmentForm.id) {
        this.saveDepartment();
      } else {
        this.updateDepartment();
      }
    },
    //根据id查询部门信息
    getInfo(id) {
      departApi.getInfoById(id).then((response) => {
        this.departmentForm = response.data.department;
        this.title='编辑'
        this.dialogFormVisible = true;
      });
    },
    //修改部门信息
    updateDepartment() {
      departApi
        .update(this.departmentForm)
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
    //新建部门
    saveDepartment() {
      this.dialogFormVisible = true;
      departApi
        .add(this.departmentForm)
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
    //取消操作
    cancel() {
      (this.dialogFormVisible = false), (this.departmentForm = {}); //清空表单
      this.$message({
        type: "info",
        message: "操作已取消",
      });
    },
    //删除方法
    deleteDepartment(id) {
      this.$confirm("确定删除此部门?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调用删除方法
          departApi.delete(id).then((response) => {
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
    //点击新建，先清空表单
    resetData() {
      this.departmentForm = {};
      this.title='新增'
      this.dialogFormVisible = true;
    },
  },
};
</script>
