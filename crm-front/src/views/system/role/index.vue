<template>
  <div class="app-container">
    角色列表
    <el-divider></el-divider>
    <el-row>
      <el-button type="primary" @click="dialogFormVisible = true"
        >新增</el-button
      >
    </el-row>

    <el-table
      ref="singleTable"
      :data="roleList"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <el-table-column type="index" label="编号" width="100"> </el-table-column>
      <el-table-column
        property="name"
        label="角色名称"
        width="400"
      ></el-table-column>
      <el-table-column
        property="sn"
        label="角色编号"
        width="600"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id)" type="text" size="small"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="small">删除</el-button>
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
    >
    </el-pagination>
    <!-- 模态窗口 -->

    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="70%">
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
        <!-- <p style="text-align: center; margin: 0 0 20px">角色权限</p> -->
        <div style="text-align: center">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="value"
            :left-default-checked="[2, 3]"
            :right-default-checked="[1]"
            :render-content="renderFunc"
            :titles="['权限名称', '权限名称']"
            :button-texts="['移除权限', '加入权限']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}',
            }"
            @change="handleChange"
            :data="data"
          >
            <el-button class="transfer-footer" slot="left-footer" size="small"
              >刷新所有权限</el-button
            >
            <el-button class="transfer-footer" slot="right-footer" size="small"
              >刷新所有权限</el-button
            >
          </el-transfer>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >提 交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from "@/api/system/role";
export default {
  data() {
    //穿梭框
    const generateData = (_) => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0,
        });
      }
      return data;
    };
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
      data: generateData(),
      value: [1],
      value4: [1],
      renderFunc(h, option) {
        return (
          <span>
            {option.key} - {option.label}
          </span>
        );
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取部门列表
    getList(pageNo = 1) {
      this.pageNo = pageNo;
      roleApi.list(this.pageNo, this.pageSize).then((response) => {
        this.roleList = response.data.roleList;
        this.total = response.data.total;
      });
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
</style>