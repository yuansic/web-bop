<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>交易管理</el-breadcrumb-item>
      <el-breadcrumb-item>待确认订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="toolbar-panel">
      <div class="toolbar-item">
        <span class="item-label">订单编号</span>
        <el-input
          v-model.trim="tableOptions.protocolOrderSn"
          :maxlength="50"
          clearable
          placeholder="订单编号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">合同编号</span>
        <el-input
          v-model.trim="tableOptions.protocolSn"
          :maxlength="50"
          clearable
          placeholder="合同编号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">采购商名称</span>
        <el-input
          v-model.trim="tableOptions.orderCompanyName"
          :maxlength="50"
          clearable
          placeholder="采购商名称"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">供应商名称</span>
        <el-input
          v-model.trim="tableOptions.supplierCompanyName"
          :maxlength="50"
          clearable
          placeholder="供应商名称"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">煤矿</span>
        <el-input
          v-model.trim="tableOptions.coalMineName"
          :maxlength="50"
          clearable
          placeholder="煤矿"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">创建时间</span>
        <el-date-picker
          v-model="createTimeRange"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="handleDateChange"
          :picker-options="pickerOptions"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </div>
      <div class="toolbar-item">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>
    <el-table :data="tableData.list" border>
      <el-table-column label="订单编号" prop="protocolOrderSn" min-width="110">
        <template slot-scope="scope">
          <span class="font-default pointer" @click="onJumpDetail(scope.row)">{{
            scope.row.protocolOrderSn
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同编号" prop="protocolSn" min-width="110"></el-table-column>
      <el-table-column label="订单状态" prop="statusValue" min-width="90"> </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="140"></el-table-column>
      <el-table-column label="要货时间段" prop="title" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.beginTime | timesplit }}</span>
          <span> ~ </span>
          <span>{{ scope.row.endTime | timesplit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="煤矿"
        prop="coalMineName"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="采购商名称"
        prop="orderCompanyName"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="供应商名称"
        prop="supplierCompanyName"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="供应链公司"
        prop="finCompanyName"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" min-width="80" fixed="right">
        <template slot-scope="scope">
          <span
            v-has="'mall:order:pending:confirm'"
            class="font-default pointer"
            @click="onJumpDetail(scope.row)"
            >确认订单</span
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-fix">
      <el-pagination
        :page-size="pageSize"
        :current-page.sync="pageNo"
        :total="tableData.count"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';

export default {
  mixins: [listMixin],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      createTimeRange: [],
      sendTimeRange: [],
      tableOptions: {
        coalMineName: '',
        orderCompanyName: '',
        supplierCompanyName: '',
        protocolOrderSn: '',
        protocolSn: '',
        startTime: '',
        endTime: ''
      },
      sendOptions: {},
      tableData: {}
    };
  },
  created() {
    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    handleDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.startTime = val[0];
        this.tableOptions.endTime = val[1];
      } else {
        this.tableOptions.startTime = '';
        this.tableOptions.endTime = '';
      }
    },
    handleReset() {
      this.tableOptions = {
        coalMineName: '',
        orderCompanyName: '',
        supplierCompanyName: '',
        protocolOrderSn: '',
        protocolSn: '',
        startTime: '',
        endTime: ''
      };
      this.createTimeRange = '';
      this.handleSearch();
    },
    onJumpDetail(row) {
      this.$router.push({ path: '/order/pending/detail/' + row.protocolOrderId });
    },
    async fetchData(opts) {
      const options = { pageNo: 1, pageSize: 20, ...this.sendOptions, ...opts };
      let result = await axios.post(api.queryBopProtocolOrderList, options);
      this.tableData = result.data;
    }
  }
};
</script>
