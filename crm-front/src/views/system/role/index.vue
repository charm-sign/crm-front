<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">角色管理</el-card>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="always">
      <el-row>
        <el-button type="primary" @click="resetData()">新增</el-button>
      </el-row>

      <el-table
        ref="singleTable"
        :data="roleList"
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
          label="角色名称"
          width="400"
          align="center"
        ></el-table-column>
        <el-table-column
          property="sn"
          label="角色编号"
          width="600"
          align="center"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button @click="getInfo(scope.row.id)" type="text"
              >编辑</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteRole(scope.row.id)" type="text"
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
        <el-form :model="roleForm">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="roleForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色编号" :label-width="formLabelWidth">
            <el-input v-model="roleForm.sn" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="角色权限"
            :label-width="formLabelWidth"
          ></el-form-item>
          <div style="text-align: center">
            <el-transfer
              style="text-align: left; display: inline-block"
              v-model="permissionIds"
              :render-content="renderFunc"
              :props="{ key: 'id', label: 'name' }"
              :titles="['权限名称', '权限名称']"
              :button-texts="['移除权限', '加入权限']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}',
              }"
              @change="handleChange"
              :data="permissionList"
            >
            </el-transfer>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdateRole()"
            >提 交</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import permissionApi from "@/api/system/permission";
import qs from "qs";
import roleApi from "@/api/system/role";
export default {
  data() {
    return {
      title: "",
      // 分页查询数据
      roleList: null,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      //模态窗口数据

      currentRow: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      roleForm: {
        name: "",
        sn: "",
      },

      //穿梭框
      permissionList: [], //所有权限列表
      permissionIds: [], //穿梭框右边数据id
      rolePermissionList: [], //该角色对应的权限列表
      renderFunc(h, option) {
        return (
          //穿梭框里的内容
          <span>{option.name}</span>
        );
      },
    };
  },
  created() {
    this.getList();
    this.getPermissionList();
  },
  methods: {
    //获取角色列表
    getList(pageNo = 1) {
      this.pageNo = pageNo;
      roleApi.list(this.pageNo, this.pageSize).then((response) => {
        this.roleList = response.data.roleList;
        this.total = response.data.total;
      });
    },
    //查询权限列表
    getPermissionList() {
      permissionApi.getPermissionList().then((response) => {
        this.permissionList = response.data.list;
      });
    },
    //取消操作
    cancel() {
      (this.dialogFormVisible = false),
        this.$message({
          type: "info",
          message: "操作已取消",
        });
    },

    //点击添加，先清空表单
    resetData() {
      this.roleForm = {};
      (this.permissionIds = []), (this.title = "新增");
      this.dialogFormVisible = true;
    },
    //添加角色
    saveRole() {
      this.permissionIds = qs.stringify(
        { ids: this.permissionIds },
        { indices: false }
      );
      roleApi
        .add(this.roleForm, this.permissionIds)
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
      roleApi.getInfoById(id).then((response) => {
        this.roleForm = response.data.role;
        //该角色的权限 (需要的是 ids ['1,'2','3'],但返回的是[{id,name},{id,name},{id,name}])
        this.rolePermissionList = response.data.permissionList;
        // console.log(this.rolePermissionList)
        this.permissionIds = this.rolePermissionList.map((x) => {
          return x.id;
        });
        //  console.log(this.permissionIds)
        this.title = "编辑";
        this.dialogFormVisible = true;
      });
    },
    //修改角色信息
    updateRole() {
      this.permissionIds = qs.stringify(
        { ids: this.permissionIds },
        { indices: false }
      );
      roleApi
        .update(this.roleForm, this.permissionIds)
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

    //删除方法
    deleteRole(id) {
      this.$confirm("确定删除此角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调用删除方法
          roleApi.delete(id).then((response) => {
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
    //判断是新建还是修改
    saveOrUpdateRole() {
      if (!this.roleForm.id) {
        this.saveRole();
      } else {
        this.updateRole();
      }
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    //穿梭框
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
  },
};
</script>
<style>
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
.el-transfer-panel {
  height: 300px;
  width: 230px;
}
</style>
