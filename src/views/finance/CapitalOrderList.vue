<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>资金明细</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="toolbar-panel">
      <div class="toolbar-item">
        <span class="item-label">交易时间</span>
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
          placeholder="金融订单编号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">贸易合同号</span>
        <el-input
          v-model.trim="tableOptions.sjbTradeNo"
          :maxlength="50"
          clearable
          placeholder="贸易合同号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">贸易订单号</span>
        <el-input
          v-model.trim="tableOptions.sjbPlanNo"
          :maxlength="50"
          clearable
          placeholder="贸易订单号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">账户编号</span>
        <el-input
          v-model.trim="tableOptions.accNo"
          :maxlength="50"
          clearable
          placeholder="账户编号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">交易类型</span>
        <el-select
          v-model="tableOptions.transType"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <div v-for="item in transTypeArr" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </div>
        </el-select>
      </div>
      <div class="toolbar-item">
        <span class="item-label">交易状态</span>
        <el-select
          v-model="tableOptions.transState"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <div v-for="item in transStateArr" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </div>
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
      <el-table-column label="贸易合同号" prop="sjbTradeNo" min-width="110"></el-table-column>
      <el-table-column label="贸易订单号" prop="sjbPlanNo" min-width="110"></el-table-column>
      <el-table-column label="交易时间" prop="tradeTime" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.tradeTime | stamp2TextDateFull }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易用途"
        prop="transUseageText"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="交易类型" prop="transTypeText" width="100"></el-table-column>
      <el-table-column label="账户编号" prop="accNo" min-width="160"></el-table-column>
      <el-table-column label="交易金额" align="right" prop="transAmount" min-width="120">
        <template slot-scope="scope">
          <span class="font-orange">{{ scope.row.transAmount | thousands(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易状态" prop="transStateText" min-width="100">
        <template slot-scope="scope">
          <span :class="{ 'font-red': scope.row.transState === 4 }">{{
            scope.row.transStateText
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单备注"
        prop="remarks"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="渠道商名称"
        prop="tradeCompanyName"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="供货商名称"
        prop="supplierCompanyName"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
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
import utils from '@/utils/utils';
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
        accNo: '',
        orderNo: '',
        sjbPlanNo: '',
        sjbTradeNo: '',
        transState: '',
        transType: '',
        userCode: ''
      },
      sendOptions: {},
      tableData: {},

      transTypeArr: [], //交易类型
      transStateArr: [] //交易状态
    };
  },
  async created() {
    const dict = await utils.getSysdict();
    this.transTypeArr = dict.fin_order_trans_type; //交易类型
    this.transStateArr = dict.fin_order_trans_state; //交易状态
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
        accNo: '',
        orderNo: '',
        sjbPlanNo: '',
        sjbTradeNo: '',
        transState: '',
        transType: '',
        userCode: ''
      };
      this.createTimeRange = '';
      this.handleSearch();
    },
    onJumpDetail(row) {
      this.$router.push({ path: '/order/pending/detail/' + row.protocolOrderId });
    },
    async fetchData(opts) {
      const options = { pageNo: 1, pageSize: 20, ...this.sendOptions, ...opts };
      let result = await axios.post(api.queryOrderInfoForPage, options);
      this.tableData = result.data;
    }
  }
};
</script>
