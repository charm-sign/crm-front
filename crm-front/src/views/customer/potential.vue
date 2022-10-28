<template>
  <div class="app-container">
    潜在客户管理
    <el-divider></el-divider>

    <!--查询表单-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="formInline.user" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.region" placeholder="潜在客户">
          <!-- 查询出来的 -->
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="dialogFormVisible = true"
          >添加</el-button
        >
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
    <!-- 模态窗口 -->

    <el-dialog title="添加" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-select v-model="form.name" placeholder="">
            <el-option label="男" :value="id"></el-option>
            <el-option label="女" :value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="QQ" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职业" :label-width="formLabelWidth">
          <el-select v-model="form.name" placeholder="">
            <el-option label="男" :value="id"></el-option>
            <el-option label="女" :value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源" :label-width="formLabelWidth">
          <el-select v-model="form.name" placeholder="">
            <el-option label="男" :value="id" ></el-option>
            <el-option label="女" :value="id" ></el-option>
          </el-select>
        </el-form-item>
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
      //模态窗口数据
      currentRow: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
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