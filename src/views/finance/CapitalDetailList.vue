<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>资金明细</el-breadcrumb-item>
      <el-breadcrumb-item>资金变动查询</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="toolbar-panel">
      <div class="toolbar-item">
        <span class="item-label">交易日期</span>
        <el-date-picker
          v-model="createTimeRange"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="onDateChange"
          :picker-options="pickerOptions"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </div>
      <div class="toolbar-item">
        <span class="item-label">金融订单编号</span>
        <el-input
          v-model.trim="tableOptions.orderNo"
          :maxlength="50"
          clearable
          placeholder="支付订单号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">账号</span>
        <el-input
          v-model.trim="tableOptions.acctNo"
          :maxlength="50"
          clearable
          placeholder="账号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">账号名称</span>
        <el-input
          v-model.trim="tableOptions.acctName"
          :maxlength="50"
          clearable
          placeholder="账号名称"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">交易名称</span>
        <el-input
          v-model.trim="tableOptions.tradeName"
          :maxlength="50"
          clearable
          placeholder="交易名称"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">收支类型</span>
        <el-select
          v-model="tableOptions.inoutType"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <el-option label="收入" :value="1"></el-option>
          <el-option label="支出" :value="2"></el-option>
        </el-select>
      </div>
      <div class="toolbar-item">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>

    <el-table :data="tableData.list" border>
      <el-table-column label="金融订单编号" prop="orderNo" min-width="160">
        <template slot-scope="scope">
          <span class="font-default">{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" prop="acctNo" min-width="160"> </el-table-column>
      <el-table-column label="账号名称" prop="acctName" min-width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="交易日期" prop="tradeTime" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.tradeTime | stamp2TextDateFull }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易名称"
        prop="tradeName"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="收支类型" prop="inoutType" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.row.inoutType === 1 ? 'font-green' : 'font-red'">{{
            scope.row.inoutType === 1 ? '收入' : '支出'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前余额" align="right" prop="curAmt" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.curAmt | thousands(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易金额" align="right" prop="tradeAmt" width="120">
        <template slot-scope="scope">
          <span class="font-orange">{{ scope.row.tradeAmt | thousands(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易后金额" align="right" prop="tradeAfterAmt" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.tradeAfterAmt | thousands(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前冻结" align="right" prop="curFrzAmt" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.curFrzAmt | thousands(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结/解冻金额" align="right" prop="frzAmt" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.frzAmt | thousands(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易后冻结" align="right" prop="frzAfterAmt" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.frzAfterAmt | thousands(2) }}</span>
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
import api from '@/api/finance.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';

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
        acctName: '',
        acctNo: '',
        inoutType: '',
        orderNo: '',
        tradeEndTime: '',
        tradeName: '',
        tradeStartTime: ''
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
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.tradeStartTime = val[0];
        this.tableOptions.tradeEndTime = val[1];
      } else {
        this.tableOptions.tradeStartTime = '';
        this.tableOptions.tradeEndTime = '';
      }
    },
    handleReset() {
      this.tableOptions = {
        acctName: '',
        acctNo: '',
        inoutType: '',
        orderNo: '',
        tradeEndTime: '',
        tradeName: '',
        tradeStartTime: ''
      };
      this.createTimeRange = '';
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { pageNo: 1, pageSize: 20, ...this.sendOptions, ...opts };
      let result = await axios.post(api.queryAcctExternalChgInfoForPage, options);
      this.tableData = result.data;
    }
  }
};
</script>
