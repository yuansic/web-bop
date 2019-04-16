<template>
  <div class="order-pending-detail-page">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>交易管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/order/pending/list">待确认订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>确认订单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      ref="confirmForm"
      :model="confirmForm"
      label-width="120px"
      :rules="rules"
      class="comfirm-form"
    >
      <el-form-item label="物流公司" prop="companyCarrierId">
        <el-select
          v-model="confirmForm.companyCarrierId"
          @change="handleSelectChange"
          filterable
          clearable
          remote
          :loading="loading"
          :remote-method="onRemoteMethod"
          prefix-icon="el-icon-search"
          placeholder="输入物流公司名称搜索"
        >
          <i slot="prefix" class="el-icon-search icon-t1"></i>
          <el-option
            v-for="item in carrierArr"
            :label="item.sjbCarrierName"
            :value="item.companyCarrierId"
            :key="item.companyCarrierId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="orderDetail.deliveryPayType === 'BEFOREDFFROZEN'"
        label="煤款流向"
        prop="paymentPath"
      >
        <el-radio-group v-model="confirmForm.paymentPath">
          <el-radio :label="0">供应链公司</el-radio>
          <el-radio :label="1">煤矿</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="orderDetail.deliveryPayType === 'BEFOREDFFROZEN'" label="收款账户信息">
        <div class="receiving-party">
          <el-row>
            <el-col :span="24">
              <span class="receiving-label">账户名：</span>
              <span v-if="confirmForm.paymentPath === 0">{{ finAccount.eAcctName }}</span>
              <span v-else>{{ coalmineAccount.accountName }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="receiving-label">开户行：</span>
              <span v-if="confirmForm.paymentPath === 0">{{ finAccount.bankName }}</span>
              <span v-else>{{ coalmineAccount.accountBank }}</span>
            </el-col>
          </el-row>
          <el-row v-if="confirmForm.paymentPath === 0">
            <el-col :span="24">
              <span class="receiving-label">电子账户：</span>
              <span>{{ finAccount.bankCardNumber }}</span>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col :span="24">
              <span class="receiving-label">实体账号：</span>
              <span>{{ coalmineAccount.accountNumber }}</span>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button v-has="'mall:order:pending:confirm'" type="primary" @click="onCinformOrder"
          >确认订单</el-button
        >
        <el-button v-has="'mall:order:pending:close'" type="primary" @click="onCloseOrder"
          >关闭订单</el-button
        >
        <el-button class="ml-10" @click="onBackList">返回</el-button>
      </el-form-item>
    </el-form>
    <div class="segment">
      <div class="segment-header">订单详情</div>
      <div class="segment-area">
        <el-row>
          <el-col :span="8">
            <div class="segment-label">创建时间</div>
            <div class="segment-content">{{ orderDetail.createTime }}</div>
          </el-col>
          <el-col :span="10" :offset="2" class="segment-item-ellipsis">
            <div class="segment-label">供应链公司</div>
            <div class="segment-content">{{ orderDetail.finCompanyName }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="segment-item-ellipsis">
            <div class="segment-label">供应商名称</div>
            <div class="segment-content">{{ orderDetail.supplierCompanyName }}</div>
          </el-col>
          <el-col :span="10" :offset="2" class="segment-item-ellipsis">
            <div class="segment-label">煤矿</div>
            <div class="segment-content">{{ orderDetail.coalMineName }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="segment-item-ellipsis">
            <div class="segment-label">采购商名称</div>
            <div class="segment-content">{{ orderDetail.orderCompanyName }}</div>
          </el-col>
          <el-col :span="10" :offset="2" class="segment-item-ellipsis">
            <div class="segment-label">品名</div>
            <div class="segment-content">{{ orderDetail.goodsName }}</div>
          </el-col>
        </el-row>
        <el-row class="h-auto">
          <el-col :span="8" class="segment-item-ellipsis">
            <div class="segment-label">发货地</div>
            <div
              class="segment-content"
              :title="
                `${orderDetail.sourceProvinceName} ${orderDetail.sourceCityName} ${
                  orderDetail.sourceAreaName
                } ${orderDetail.sourceAddress} `
              "
            >
              <span>{{ orderDetail.sourceProvinceName }}</span>
              <span>{{ orderDetail.sourceCityName }}</span>
              <span v-if="orderDetail.sourceAreaName">{{ orderDetail.sourceAreaName }}</span>
              <span>，{{ orderDetail.sourceAddress }}</span>
            </div>
          </el-col>
          <el-col :span="10" :offset="2" class="segment-item-ellipsis">
            <div class="segment-label">收货地</div>
            <div
              class="segment-content"
              :title="
                `${orderDetail.targetProvinceName} ${orderDetail.targetCityName} ${
                  orderDetail.targetAreaName
                } ${orderDetail.targetAddress} `
              "
            >
              <span>{{ orderDetail.targetProvinceName }}</span>
              <span>{{ orderDetail.targetCityName }}</span>
              <span v-if="orderDetail.targetAreaName">{{ orderDetail.targetAreaName }}</span>
              <span>，{{ orderDetail.targetAddress }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="segment-label">要货数量</div>
            <div class="segment-content">{{ orderDetail.number | toFixed(2) }} 吨</div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="segment-label">要货时间段</div>
            <div class="segment-content">
              {{ orderDetail.beginTime | timesplit }} ~ {{ orderDetail.endTime | timesplit }}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="segment-label">坑口含税价</div>
            <div class="segment-content font-orange">
              {{ orderDetail.taxUnitPrice | thousands(2) }} 元/吨
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="segment-label">矿发煤价</div>
            <div class="segment-content">
              <span v-if="orderDetail.goodsMinePrice"
                >{{ orderDetail.goodsMinePrice | thousands(2) }} 元/吨</span
              >
              <span v-else>-</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="segment-label">运价</div>
            <div class="segment-content font-orange">
              {{ orderDetail.freightPrice | thousands(2) }} 元/吨
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="segment-label">运价优惠价点位</div>
            <div class="segment-content">{{ orderDetail.taxRate }} %</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="segment-label">一票优惠价</div>
            <div class="segment-content font-green">
              {{ orderDetail.discountsPrice | thousands(2) }} 元/吨
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 关闭订单 -->
    <el-dialog width="480px" title="关闭订单" :visible.sync="closeOrderForm.visible">
      <div class="mb-10">关闭理由</div>
      <el-input
        type="textarea"
        :rows="3"
        :maxlength="200"
        placeholder="请输入关闭理由"
        v-model="closeOrderForm.remark"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="ml-10" @click="confirmCloseOrder">确定</el-button>
        <el-button @click="closeOrderForm.visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Validator from '@/utils/Validator';
import axios from '@/utils/axios';
import api from '@/api/mall.api';

export default {
  data: function() {
    return {
      loading: false,
      confirmForm: {
        companyCarrierId: '',
        paymentPath: 0
      },
      rules: {
        companyCarrierId: [{ required: true, message: '请选择物流公司', trigger: 'change' }]
      },
      orderDetail: {},
      carrierArr: [],
      closeOrderForm: {
        visible: false,
        remark: ''
      },
      finAccount: {},
      coalmineAccount: {},
      isLoadCoalAccount: false
    };
  },
  watch: {
    'confirmForm.paymentPath': function(newValue, oldValue) {
      if (newValue === 1 && !this.isLoadCoalAccount) {
        // 查询煤矿账户信息
        axios
          .get(api.queryBdCoalMineAccout, {
            params: { protocolOrderId: this.$route.params.id }
          })
          .then(res => {
            this.coalmineAccount = res.data;
            this.isLoadCoalAccount = true;
          })
          .catch(e => {
            this.isLoadCoalAccount = true;
          });
      }
    }
  },
  async created() {
    let result = await axios.get(api.queryBopProtocolOrderDtail, {
      params: { protocolOrderId: this.$route.params.id }
    });
    this.orderDetail = result.data;

    // 两款分离 才显示煤款流向
    if (result.data.deliveryPayType === 'BEFOREDFFROZEN') {
      // 查询供应链账户信息
      let coalRes = axios.get(api.getAcctExternalByUserCode, {
        params: { userCode: result.data.finCompanyId }
      });
      coalRes.then(res => (this.finAccount = res.data));
    }
    this.onRemoteMethod();
  },
  methods: {
    onCinformOrder() {
      this.$refs.confirmForm.validate(async valid => {
        if (valid) {
          if (this.confirmForm.paymentPath === 1 && !this.coalmineAccount.accountNumber) {
            this.$message.error('该煤矿未录入收款账户信息，请补充该信息后重新操作');
            return;
          }
          let response = await axios.post(api.confirmCarrier, {
            companyCarrierId: this.confirmForm.companyCarrierId,
            paymentPath: this.confirmForm.paymentPath,
            protocolOrderId: this.orderDetail.protocolOrderId,
            finCompanyId: this.orderDetail.finCompanyId
          });
          this.$message.success('订单已确认');
          this.$router.push({ path: '/order/pending/list' });
        }
      });
    },
    onCloseOrder() {
      this.closeOrderForm.visible = true;
      this.closeOrderForm.remark = '';
    },
    // 确认订单选择承运商 模糊搜索
    async onRemoteMethod(query) {
      this.loading = true;
      let response = await axios.post(
        api.queryFullName,
        { fullName: query, pageNo: 1, pageSize: 20 },
        { silence: true }
      );
      this.carrierArr = response.data.list;
      this.loading = false;
    },
    // 确认关闭订单
    async confirmCloseOrder() {
      if (!this.closeOrderForm.remark) {
        this.$message.error('请填写关闭理由');
        return;
      }
      await axios.post(api.finClose, {
        protocolOrderId: this.orderDetail.protocolOrderId,
        remark: this.closeOrderForm.remark,
        finCompanyId: this.orderDetail.finCompanyId
      });
      this.closeOrderForm.visible = false;
      this.$message.success('订单已关闭');
      this.$router.push({ path: '/order/pending/list' });
    },
    handleSelectChange(val) {},
    onBackList() {
      this.$router.push({ path: '/order/pending/list' });
    }
  }
};
</script>
