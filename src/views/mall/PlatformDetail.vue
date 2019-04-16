<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>平台公司列表</el-breadcrumb-item>
      <el-breadcrumb-item>公司详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-hander-panel">
      <span class="font-label">公司编号：</span>
      <span class="font-default">{{ detailData.companyCode }}</span>
      <span class="font-label ml-40">公司名称：</span>
      <span class="font-default">{{ detailData.fullName }}</span>

      <el-button class="ml-20" type="primary" @click="onJumpBack">返回列表</el-button>
    </div>
    <!-- 公司信息 -->
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

    <!-- 关联煤矿 -->
    <div class="segment">
      <div class="segment-header">关联煤矿</div>
      <div class="segment-area">
        <div>
          <el-button type="primary" plain @click="selectCoalmineVisible = true">新增关联</el-button>
        </div>
        <conn-coal-mine ref="connCoalMine" :companyId="companyId"></conn-coal-mine>
      </div>
    </div>

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

import ConnCoalMine from './ConnCoalMine'; // 关联的煤矿
import SelectCoalMine from './SelectCoalMine'; // 选择煤矿

export default {
  components: {
    ConnCoalMine,
    SelectCoalMine
  },
  data: function() {
    return {
      companyId: '',
      detailData: {},
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
    onMethods() {},
    onJumpBack() {
      this.$router.push({ path: '/platform/list' });
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
