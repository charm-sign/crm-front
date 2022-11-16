<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">权限管理</el-card></el-card>
    <el-divider></el-divider>
    <el-card class="box-card" shadow="always">
    <el-row>
      <el-button type="primary" @click="getList()">重新加载</el-button>
    </el-row>

    <el-table
      ref="singleTable"
      :data="permissionList"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <el-table-column label="序号" width="80" align="center">
        <template slot-scope="scope">
          <!-- 固定公式 -->
          {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        property="name"
        label="权限名称"
        width="400"
        align="center"
      ></el-table-column>
      <el-table-column
        property="expression"
        label="权限表达式"
        width="600"
        align="center"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="deletePermission(scope.row.id)"
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
    align="right">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import permissionApi from "@/api/system/permission";

export default {
  data() {
    return {
      permissionList: null,
      total: 0,
      pageNo: 1,
      pageSize: 10,
      currentRow: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //查询权限列表
    getList(pageNo = 1) {
      this.pageNo = pageNo;
      permissionApi.list(this.pageNo, this.pageSize).then((response) => {
        this.permissionList = response.data.permissionList;
        this.total = response.data.total;
      });
    },
    //删除权限
    deletePermission(id) {
      this.$confirm("确定删除此权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调用删除方法
          permissionApi.delete(id).then((response) => {
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

    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
  },
};
</script>