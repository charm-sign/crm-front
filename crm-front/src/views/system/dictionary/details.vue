<template>
  <div class="app-container">
    <el-card>字典明细

    </el-card>
    
    <el-divider></el-divider>
              
    <el-card>
      <font size="4">数据字典分组</font>
      
      <el-tabs :tab-position="tabPosition" style="height: 490px">
        
        <el-tab-pane
          v-for="(dictionaryDetail, index) in dictionaryDetailList"
          :label="dictionaryDetail.name"
          :key="index"
          :value="dictionaryDetail.id"

        align="left">
          &nbsp;{{ dictionaryDetail.name }}明细
          <!-- this.parentId={{dictionaryDetail.id}} -->
          <br>&nbsp;</br>
      <el-form :inline="true" class="demo-form-inline">
              <el-button type="primary" @click="resetData(dictionaryDetail.id)"
                 align="center">添加字典明细</el-button
              >
          </el-form>
          <el-divider></el-divider>
  
          <el-table 
          
           border
            ref="multipleTable"
            :data="dictionaryDetail.detailList"
            tooltip-effect="dark"
            style="width: 100%"  max-height="350"
            @selection-change="handleSelectionChange"
          >
         
            <el-table-column
              prop="title"
              label="名称"
              width="400"
              align="center"
            >
            </el-table-column>
     
            <el-table-column
              prop="sequence"
              label="序列"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="180"
              align="center"
            >
            
              <template slot-scope="scope">
                <el-button @click="getInfo(scope.row.id)" type="text"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          
        </el-tab-pane>
        
      </el-tabs>
      
    </el-card>
       <!-- 模态窗口 -->

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="detailForm" :rules="rules" ref="detailForm">
        <el-form-item label="字典明细名称" :label-width="formLabelWidth" prop="title">
          <el-input v-model="detailForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典明细序列" :label-width="formLabelWidth" prop="sequence">
          <el-input-number v-model.number="detailForm.sequence" autocomplete="off"></el-input-number>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateDetail('detailForm')"
          >提 交</el-button
        >
      </div>
    </el-dialog>
  </div>
  
</template>
<script>
import dictApi from "@/api/system/dictionary";
export default {
  data() {
    return {
       rules: {
        title: [
          { required: true, message: '请输入字典明细名称', trigger: 'blur' },
        ],
        sequence: [
          { required: true, message: '请输入字典明细序列' },
          {type:'number',message:'序列必须为数字值'}
        ],
      },
      //明细列表
      dictionaryDetailList: [],
      dictQuery: {},
      tabPosition: "left",
      //模态框
      title: "",
      parentId: '',
      detailForm: {
        // parentId:'',
        title: "",
        sequence: "",
      },
      dialogFormVisible: false,
    };
  },

  created() {
    this.getList();
  },
  methods: {
    //获取所有数据
    getList() {
      dictApi.detailList2().then((response) => {
        this.dictionaryDetailList = response.data.dictionaryDetailList;
      });
    },
    //点击添加，先清空表单
    resetData(id) {
      if (this.$refs.detailForm){
this.$refs.detailForm.resetFields();}  
      this.detailForm = {};
      this.parentId=id
      this.title = "新增";
      this.dialogFormVisible = true;
    },
    //取消操作
    cancel() {
      (this.dialogFormVisible = false),
        this.$message({
          type: "info",
          message: "操作已取消",
        });
    },
    //提交判断
    saveOrUpdateDetail() {
      if (!this.detailForm.id) {
        this.save('detailForm');
      } else {
        this.edit('detailForm');
      }
    },
    //添加字典     
    save(detailForm) {
      this.$refs[detailForm].validate((valid) => {
          if (valid) {
           dictApi
        .addDetail(this.parentId,this.detailForm)
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
          } else {
           
            return false;
          }
        });
     
    },
    //点击编辑，根据id查询明细信息
    getInfo(id) {
      if (this.$refs.detailForm){
this.$refs.detailForm.resetFields();} 
      dictApi.getInfoById(id).then((response) => {
        this.detailForm = response.data.dictionaryDetails;
        this.title = "编辑";
        this.dialogFormVisible = true;
      });
    },
    //修改字典信息
    edit(detailForm) {
      this.$refs[detailForm].validate((valid) => {
          if (valid) {
           dictApi
        .updateDetail(this.detailForm)
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
          } else {
            
            return false;
          }
        });
     
    },
  },
};
</script>