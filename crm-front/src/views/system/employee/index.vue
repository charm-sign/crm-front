<template>
  <div class="app-container">
    员工管理
    <el-divider></el-divider>

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
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit">查询</el-button>
        <el-button @click="dialogFormVisible = true">添加</el-button>
        <el-button type="primary" @click="onDelete">批量删除</el-button>
        <el-button type="primary" @click="onExport">导出</el-button>
        <el-button @click="onImport">导入数据</el-button>
        <el-button type="primary" plain @click="onTemplate">导入模板</el-button>
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
      <el-table-column property="id" type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" label="编号" width="80"> </el-table-column>

      <el-table-column
        property="name"
        label="名称"
        width="120"
      ></el-table-column>
      <el-table-column prop="email" label="email" width="200">
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="80">
      </el-table-column>
      <el-table-column prop="departmentName" label="部门" width="150">
      </el-table-column>
      <!-- 需要判断 -->
      <el-table-column prop="roleNames" label="角色" show-overflow-tooltip>
      </el-table-column>
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
      <el-form :model="form">
        <el-form-item label="员工名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工年龄" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工email" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工部门" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="超级管理员" :label-width="formLabelWidth">
          <el-radio v-model="radio" label="1">是</el-radio>
          <el-radio v-model="radio" label="2">否</el-radio>
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
import employeeApi from "@/api/system/employee";

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
      // 分页查询数据
      employeeDetailList: null,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      employeeQuery: {}, //查询参数
      radio: "1",
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
      tableData: [],
      multipleSelection: [],
      //模态窗口
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
      currentRow: null,
    };
  },
  created() {
    this.getList()
  },
  methods: {
    //分页条件查询
    getList(pageNo=1) {
     this.pageNo=pageNo
      employeeApi.conditionList(this.pageNo, this.pageSize, this.employeeQuery).then(response => { 
        this.employeeDetailList = response.data.employeeDetailList
       this.total= response.data.total
      })
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