<template>
  <div class="app-container">
    <el-card>字典列表</el-card>
    <el-divider></el-divider>
<el-card>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="dictQuery.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item>
         <el-button type="primary" @click="getList()" icon="el-icon-search"  plain>查询</el-button>
        <el-button type="primary" @click="resetData()">添加数据字典</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="dictList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" width="150" align="center">
        <template slot-scope="scope">
          <!-- 固定公式 -->
          {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="200" align="center"> </el-table-column>
      <el-table-column
        prop="sn"
        label="编码"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="intro"
        label="简介"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="getInfo(scope.row.id)" type="text">编辑</el-button>
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

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="dictionaryForm">
        <el-form-item label="数据字典名称" :label-width="formLabelWidth">
          <el-input v-model="dictionaryForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据字典编号" :label-width="formLabelWidth">
          <el-input v-model="dictionaryForm.sn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据字典简介" :label-width="formLabelWidth">
          <el-input
            v-model="dictionaryForm.intro"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateDictionary()"
          >提 交</el-button
        >
      </div>
    </el-dialog></el-card>
  </div>
</template>

<script>
import dictApi from "@/api/system/dictionary";
export default {
  data() {
    return {
      dictList: null,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      dictQuery: {}, //查询参数

      multipleSelection: [],
      //模态窗口数据
      title: "",
      currentRow: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dictionaryForm: {
        //编辑表单
        name: "",
        sn: "",
        intro: "",
      },
      formLabelWidth: "120px",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //分页条件查询字典列表
    getList(pageNo = 1) {
      this.pageNo = pageNo;
      dictApi
        .list(this.pageNo, this.pageSize, this.dictQuery)
        .then((response) => {
          this.dictList = response.data.dictionaryList;
          this.total = response.data.total;
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
      this.dictionaryForm = {};
      this.title = "新增";
      this.dialogFormVisible = true;
    },
    //点击编辑，根据id查询部门信息
    getInfo(id) {
      dictApi.getInfo(id).then((response) => {
        this.dictionaryForm = response.data.dictionary;
        this.title = "编辑";
        this.dialogFormVisible = true;
      });
    },
    //添加字典
    save() {
      dictApi
        .add(this.dictionaryForm)
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
    //修改字典信息
    edit() {
      dictApi
        .update(this.dictionaryForm)
        .then((response) => {
          this.getList();
          this.dialogFormVisible = false;
        })
        .then(() => {
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
    //提交判断
    saveOrUpdateDictionary() {
      if (!this.dictionaryForm.id) {
        this.save();
      } else {
        this.edit();
      }
    },
  },
};
</script>