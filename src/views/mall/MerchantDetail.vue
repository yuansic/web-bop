<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>商户列表</el-breadcrumb-item>
      <el-breadcrumb-item>商户详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-hander-panel">
      <span class="font-label">商户编号：</span>
      <span class="font-default">{{ detailData.companyCode }}</span>
      <span class="font-label ml-40">商户名称：</span>
      <span class="font-default">{{ detailData.fullName }}</span>

      <el-button class="ml-20" type="primary" @click="onJumpBack">返回列表</el-button>
    </div>
    <!-- 商户信息 -->
    <div class="segment merchant-detail-segment">
      <div class="segment-header">商户信息</div>
      <div class="segment-area">
        <el-row>
          <el-col :span="12">
            <div class="segment-label">商户类型</div>
            <div class="segment-content">
              {{ detailData.companyTypeValue }}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="segment-label">社会统一信用代码</div>
            <div class="segment-content">{{ detailData.socialCreditCode }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="segment-item-ellipsis">
            <div class="segment-label">是否启用</div>
            <div class="segment-content">
              <el-switch
                v-model="detailData.isDisabled"
                active-color="#ff4949"
                inactive-color="#13ce66"
              ></el-switch>
              <span class="ml-10">{{ detailData.isDisabled ? '已禁用' : '已启用' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="segment-label">是否自营</div>
            <div class="segment-content">{{ detailData.isSelfValue }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="segment-item-ellipsis">
            <div class="segment-label">法人</div>
            <div class="segment-content" :title="detailData.legalPersonName">
              {{ detailData.legalPersonName }}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="segment-label">法人身份证</div>
            <div class="segment-content">{{ detailData.legalPersionIdentity }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="segment-item-ellipsis">
            <div class="segment-label">开户行</div>
            <div class="segment-content" :title="detailData.bankName">
              {{ detailData.bankName }}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="segment-label">银行卡号</div>
            <div class="segment-content">{{ detailData.bankCardNumber }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="segment-item-ellipsis">
            <div class="segment-label">结算账户名</div>
            <div class="segment-content" :title="detailData.acctName">
              {{ detailData.acctName }}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="segment-label">电子邮箱</div>
            <div class="segment-content">{{ detailData.email }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="segment-label">联系人</div>
            <div class="segment-content">{{ detailData.contactPeople }}</div>
          </el-col>
          <el-col :span="12">
            <div class="segment-label">联系电话</div>
            <div class="segment-content">{{ detailData.contactNumber }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="segment-item-ellipsis">
            <div class="segment-label">联系地址</div>
            <div class="segment-content" :title="detailData.contactAddress">
              {{ detailData.contactAddress }}
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 关联供应商 -->
    <div class="segment" v-if="detailData.companyType === 'BROKER'">
      <div class="segment-header">关联供应商</div>
      <div class="segment-area">
        <div>
          <el-button class="mb-15" type="primary" plain @click="handleCheckSupplier"
            >新增关联</el-button
          >
          <conn-supplier
            ref="connSupplier"
            :sourceId="companyId"
            :listUrl="connSupplierUrl"
          ></conn-supplier>
        </div>
      </div>
    </div>
    <!-- 关联供应链 -->
    <div
      class="segment"
      v-if="detailData.companyType === 'SUPPLIER' || detailData.companyType === 'BROKER'"
    >
      <div class="segment-header">关联供应链</div>
      <div class="segment-area">
        <div>
          <el-button class="mb-15" type="primary" plain @click="selectSupplyChainVisible = true"
            >新增关联</el-button
          >
          <conn-supply-chain
            ref="connSupplyChain"
            :sourceId="companyId"
            :listUrl="connSupplyChainUrl"
          ></conn-supply-chain>
        </div>
      </div>
    </div>
    <!-- 关联煤矿 -->
    <div class="segment" v-if="detailData.companyType === 'BROKER'">
      <div class="segment-header">关联煤矿</div>
      <div class="segment-area">
        <div>
          <el-button type="primary" plain @click="selectCoalmineVisible = true">新增关联</el-button>
        </div>
        <conn-coal-mine ref="connCoalMine" :companyId="companyId"></conn-coal-mine>
      </div>
    </div>

    <!-- 选择供应商dialog -->
    <el-dialog title="选择供应商" :visible.sync="selectSupplierVisible">
      <select-supplier
        v-if="selectSupplierVisible"
        ref="supplierSelect"
        :sourceId="companyId"
        @dbclick="handleSupplierSubmit"
      ></select-supplier>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSupplierSubmit">确 定</el-button>
        <el-button @click="selectSupplierVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 选择供应链dialog -->
    <el-dialog title="选择供应链" :visible.sync="selectSupplyChainVisible">
      <select-supply-chain
        v-if="selectSupplyChainVisible"
        ref="supplyChainSelect"
        :sourceId="companyId"
        :listUrl="selectSupplyChainUrl"
        @dbclick="handleSupplyChainSubmit"
      ></select-supply-chain>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSupplyChainSubmit">确 定</el-button>
        <el-button @click="selectSupplyChainVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 选择煤矿dialog -->
    <el-dialog title="选择煤矿" :visible.sync="selectCoalmineVisible">
      <select-coal-mine
        v-if="selectCoalmineVisible"
        ref="coalMineSelect"
        :companyId="companyId"
        @dbclick="handleCoalMineSubmit"
      ></select-coal-mine>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCoalMineSubmit">确 定</el-button>
        <el-button @click="selectCoalmineVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import utils from '@/utils/utils';

import ConnSupplier from './ConnSupplier'; // 关联的供应商
import ConnSupplyChain from './ConnSupplyChain'; // 关联的供应链
import ConnCoalMine from './ConnCoalMine'; // 关联的煤矿
import SelectSupplier from './SelectSupplier'; // 选择供应商
import SelectSupplyChain from './SelectSupplyChain'; // 选择供应链
import SelectCoalMine from './SelectCoalMine'; // 选择煤矿

export default {
  components: {
    ConnSupplier,
    ConnSupplyChain,
    ConnCoalMine,
    SelectSupplier,
    SelectSupplyChain,
    SelectCoalMine
  },
  data: function() {
    return {
      companyId: '',
      detailData: {},
      connSupplierUrl: api.selectCompanyRelation, // 关联供应商列表的url
      selectSupplierVisible: false, // 选择供应商的dialog开关
      connSupplyChainUrl: api.selectCompanyRelation, // 关联供应链列表的url
      selectSupplyChainVisible: false, // 选择供应链的dialog开关
      selectSupplyChainUrl: api.selectNotCompanyRelation, // 选择供应链dialog的列表的url
      selectCoalmineVisible: false // 选择煤矿的dialog开关
    };
  },
  async created() {
    this.companyId = this.$route.params.companyId;
    let detailData = await axios.get(api.queryCompayDetailById, {
      params: { companyId: this.$route.params.companyId }
    });
    this.detailData = detailData.data;
  },
  methods: {
    handleCheckSupplier() {
      const len = this.$refs.connSupplier.getRowLength();
      if (len > 0) {
        this.$message.error('不可继续关联');
        return;
      }
      this.selectSupplierVisible = true;
    },
    onJumpBack() {
      this.$router.push({ path: '/merchant/list' });
    },
    // 新增供应商关联
    async handleSupplierSubmit() {
      const currentRow = this.$refs.supplierSelect.getCurrentRow();
      if (currentRow) {
        await axios.post(api.saveCompanyRelationship, {
          targetId: currentRow.companyId,
          sourceId: this.companyId
        });
        this.selectSupplierVisible = false;
        this.$message.success('关联成功');
        this.$refs.connSupplier.handleSearch();
      } else {
        this.$message.error('请选择一个供应商');
      }
    },
    // 新增供应链关联
    async handleSupplyChainSubmit() {
      const currentRow = this.$refs.supplyChainSelect.getCurrentRow();
      if (currentRow) {
        await axios.post(api.saveCompanyRelationship, {
          targetId: currentRow.companyId,
          sourceId: this.companyId
        });
        this.selectSupplyChainVisible = false;
        this.$message.success('关联成功');
        this.$refs.connSupplyChain.handleSearch();
      } else {
        this.$message.error('请选择一个供应链');
      }
    },
    // 新增煤矿关联
    async handleCoalMineSubmit() {
      const currentRow = this.$refs.coalMineSelect.getCurrentRow();
      if (currentRow) {
        await axios.post(api.saveCompanyCoalMine, {
          coalMineId: currentRow.coalMineId,
          companyId: this.companyId
        });
        this.selectCoalmineVisible = false;
        this.$refs.connCoalMine.handleSearch();
      } else {
        this.$message.error('请选择一个煤矿');
      }
    }
  }
};
</script>
<style>
</style>
