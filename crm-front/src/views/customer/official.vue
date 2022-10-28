<template>
  <div class="app-container">
    正式客户管理
    <el-divider></el-divider>

    <!--查询表单-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="formInline.user" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.region" placeholder="正式客户">
          <!-- 查询出来的 -->
          <el-option label="正式客户" value="shanghai"></el-option>
          <el-option label="全部" value="beijing"></el-option>
           <el-option label="流失" value="hbjn"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" label="编号" width="50"> </el-table-column>
      <el-table-column label="姓名" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="年龄" width="120"> </el-table-column>
      <el-table-column prop="name" label="性别" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address" label="电话" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address" label="QQ" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address" label="职业" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="来源" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="营销人员" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="状态" show-overflow-tooltip>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id)" type="text" size="small"
            >编辑</el-button
          >
          <el-button @click="handleClick(scope.row.id)" type="text" size="small"
            >跟进</el-button
          >
          <el-button @click="handleClick(scope.row.id)" type="text" size="small"
            >移交</el-button
          >
          <el-button @click="handleClick(scope.row.id)" type="text" size="small"
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
      :page-size="2"
      :total="10"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      formInline: {
        user: "",
        region: "",
      },
      multipleSelection: [],
    };
  },

  methods: {
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