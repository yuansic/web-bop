<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>资金明细</el-breadcrumb-item>
      <el-breadcrumb-item>交易流水</el-breadcrumb-item>
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
        <span class="item-label">支付流水号</span>
        <el-input
          v-model.trim="tableOptions.flowCode"
          :maxlength="50"
          clearable
          placeholder="支付流水号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">金融订单编号</span>
        <el-input
          v-model.trim="tableOptions.orderNo"
          :maxlength="50"
          clearable
          placeholder="订单编号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">第三方流水号</span>
        <el-input
          v-model.trim="tableOptions.thirdCode"
          :maxlength="50"
          clearable
          placeholder="第三方流水号"
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
      <!-- 银行托管 -->
      <div class="toolbar-item">
        <span class="item-label">银行托管</span>
        <el-select
          v-model="tableOptions.bankChlType"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <div v-for="item in bankChlTypeArr" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </div>
        </el-select>
      </div>
      <!-- 交易用途 -->
      <div class="toolbar-item">
        <span class="item-label">交易用途</span>
        <el-select
          v-model="tableOptions.transUseage"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <div v-for="item in transUseageArr" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </div>
        </el-select>
      </div>
      <!-- 交易类型 -->
      <div class="toolbar-item">
        <span class="item-label">交易类型</span>
        <el-select
          v-model="tableOptions.txType"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <div v-for="item in txTypeArr" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </div>
        </el-select>
      </div>
      <!-- 交易状态 -->
      <div class="toolbar-item">
        <span class="item-label">交易状态</span>
        <el-select
          v-model="tableOptions.txStat"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <div v-for="item in txStatArr" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </div>
        </el-select>
      </div>
      <!-- 支付方式 -->
      <div class="toolbar-item">
        <span class="item-label">支付方式</span>
        <el-select
          v-model="tableOptions.payMethod"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <div v-for="item in payMethodArr" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </div>
        </el-select>
      </div>
      <div class="toolbar-item">
        <span class="item-label">付款方账号</span>
        <el-input
          v-model.trim="tableOptions.accNo"
          :maxlength="50"
          clearable
          placeholder="付款方账号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">收款方账号</span>
        <el-input
          v-model.trim="tableOptions.toAccNo"
          :maxlength="50"
          clearable
          placeholder="收款方账号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>

    <el-table :data="tableData.list" border>
      <el-table-column label="支付流水号" prop="flowCode" min-width="220">
        <template slot-scope="scope">
          <span class="font-default">{{ scope.row.flowCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金融订单编号" prop="orderNo" min-width="150"></el-table-column>
      <el-table-column label="第三方流水号" prop="thirdCode" width="140"></el-table-column>
      <el-table-column label="交易时间" prop="tradeTime" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.tradeTime | stamp2TextDateFull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="贸易合同号" prop="sjbTradeNo" width="100"></el-table-column>
      <el-table-column label="原冻结单号" prop="oriFrzOrderNo" min-width="150"></el-table-column>
      <el-table-column label="交易金额" prop="txAmt" align="right" min-width="110">
        <template slot-scope="scope">
          <span class="font-orange">{{ scope.row.txAmt | thousands(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易用途" prop="transUseageText" width="90"></el-table-column>
      <el-table-column label="交易类型" prop="txTypeText" width="100"></el-table-column>
      <el-table-column label="交易状态" prop="txStatText" min-width="90">
        <template slot-scope="scope">
          <!-- 交易失败 初始化状态可能会有失败原因 -->
          <el-popover
            v-if="scope.row.txStat === 2 || (scope.row.txStat === 1 && scope.row.failedTime)"
            placement="top"
            width="250"
            popper-class="multiple-popover"
            trigger="hover"
          >
            <div class="multiple-popover-item">
              <span class="font-orange">失败时间：</span>
              {{ scope.row.failedTime | stamp2TextDateFull }}
            </div>
            <div class="multiple-popover-item">
              <span class="font-orange">失败原因：</span>
              {{ scope.row.failedDesc }}
            </div>
            <span slot="reference" class="pointer font-red">{{ scope.row.txStatText }}</span>
          </el-popover>
          <span v-else> {{ scope.row.txStatText }} </span>
        </template>
      </el-table-column>
      <el-table-column label="托管银行" prop="bankChlTypeText" width="70"></el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="支付方式" prop="payMethodText" width="80"></el-table-column>
      <el-table-column label="付款方账号" prop="accNo" min-width="165"></el-table-column>
      <el-table-column
        label="付款方名称"
        prop="userName"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="收款方账号" prop="toAccNo" min-width="160"></el-table-column>
      <el-table-column
        label="收款方名称"
        prop="toUserName"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column label="失败时间" prop="failedTime" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.failedTime | stamp2TextDateFull }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="失败原因"
        prop="failedDesc"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column> -->
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
        bankChlType: '',
        flowCode: '',
        orderNo: '',
        payMethod: '',
        sjbTradeNo: '',
        thirdCode: '',
        toAccNo: '',
        transUseage: '',
        txStat: '',
        txType: ''
      },
      sendOptions: {},
      tableData: {},
      bankChlTypeArr: [], //银行托管筛选项
      transUseageArr: [], //交易用途筛选项
      txTypeArr: [], // 交易类型筛选项
      txStatArr: [], //交易状态筛选项
      payMethodArr: [] //支付方式筛选项
    };
  },
  async created() {
    const dict = await utils.getSysdict();
    // console.log(dict, 'dict');
    this.bankChlTypeArr = dict.fin_chl_type; // 银行托管筛选项
    this.transUseageArr = dict.fin_trans_useage; // 交易用途筛选项
    this.txTypeArr = dict.fin_order_trans_type; // 交易类型筛选项
    this.txStatArr = dict.fin_flow_tx_stat; // 交易状态筛选项
    this.payMethodArr = dict.fin_pay_method; // 支付方式筛选项

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
        bankChlType: '',
        flowCode: '',
        orderNo: '',
        payMethod: '',
        sjbTradeNo: '',
        thirdCode: '',
        toAccNo: '',
        transUseage: '',
        txStat: '',
        txType: ''
      };
      this.createTimeRange = '';
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { pageNo: 1, pageSize: 20, ...this.sendOptions, ...opts };
      let result = await axios.post(api.payFundFlowQueryOrderInfoForPage, options);
      this.tableData = result.data;
    }
  }
};
</script>
