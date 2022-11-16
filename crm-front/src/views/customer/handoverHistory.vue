<template>
  <div class="app-container">
    <el-card>移交历史</el-card>
    <el-divider></el-divider>

    <!--查询表单-->
    <el-card>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input
          v-model="customerHandoverQuery.name"
          placeholder="请输入客户姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="跟进时间">
        <el-date-picker
          v-model="customerHandoverQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="customerHandoverQuery.endTime"
          type="datetime"
          placeholder="选择结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList()" icon="el-icon-search" plain
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="customerHandoverList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          <!-- 固定公式 -->
          {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="customerName"
        label="客户姓名"
        width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="transTime"
        label="操作日期"
        width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作人"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="oldMarket"
        label="旧营销人员"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="newMarket"
        label="新营销人员"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="transReason"
        label="移交原因"
        show-overflow-tooltip
        align="center"
      >
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
import handoverApi from "@/api/customer/handoverHistory";
export default {
  data() {
    return {
      customerHandoverList: null,
      customerHandoverQuery: {
        name: "",
        startTime: null,
        endTime: null,
      },
      //分页数据
      total: 0,
      pageNo: 1,
      pageSize: 10,

      multipleSelection: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 分页条件查询
    getList(pageNo = 1) {
      this.pageNo = pageNo;
      handoverApi
        .list(this.pageNo, this.pageSize, this.customerHandoverQuery)
        .then((response) => {
          this.customerHandoverList = response.data.customerHandoverDetailList;
          this.total = response.data.total;
        });
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