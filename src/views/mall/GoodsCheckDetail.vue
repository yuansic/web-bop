<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods/check/list' }">商品审核</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-hander-panel">
      <span style="display:inline-block;min-width:370px">
        <span class="font-label">编号：</span>
        <span class="font-default">{{ detailData.goodsSn }}</span>
        <span class="font-label ml-20">发布日期：</span>
        <span>{{ detailData.createTime }}</span>
      </span>
      <span v-if="detailData.state === 40">
        <el-button type="primary" @click="onCheckPass">通过审核</el-button>
        <el-button @click="refuseDialog.visible = true">拒绝通过</el-button>
        <router-link to="/goods/check/list">
          <el-button class="ml-10">返回</el-button>
        </router-link>
      </span>
    </div>
    <div class="goods-detail-component">
      <div class="goods-detail-order-form-panel cl">
        <goods-base-info :goodsInfo="detailData"></goods-base-info>
      </div>
      <goods-base-quota :goodsQuota="goodsQuota"></goods-base-quota>
      <goods-base-price :goodsPrice="goodsPrice"></goods-base-price>
    </div>

    <!-- 拒绝通过 -->
    <el-dialog width="480px" title="拒绝通过" :visible.sync="refuseDialog.visible">
      <div class="mb-10">拒绝理由</div>
      <el-input
        type="textarea"
        :rows="3"
        :maxlength="200"
        placeholder="请输入拒绝理由"
        v-model="refuseDialog.remarks"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="ml-10" @click="onCheckBack">确定</el-button>
        <el-button @click="refuseDialog.visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import GoodsBaseInfo from '@/components/GoodsBaseInfo';
import GoodsBaseQuota from '@/components/GoodsBaseQuota';
import GoodsBasePrice from '@/components/GoodsBasePrice';

export default {
  components: {
    GoodsBaseInfo,
    GoodsBaseQuota,
    GoodsBasePrice
  },
  data() {
    return {
      goodsId: '',
      detailData: {
        goodsNormList: [],
        goodsImgList: [],
        goodsPriceHistoryList: [],
        coalMineList: [],
        goodsPlanList: [],
        saleSupplier: []
      },
      refuseDialog: {
        visible: false,
        remarks: ''
      },
      goodsQuota: [],
      goodsPrice: []
    };
  },
  async created() {
    this.goodsId = this.$route.params.goodsId || '';
    let response = await axios.get(api.goodsFindDetail, { params: { goodsId: this.goodsId } });

    let saleSupplier = [];
    response.data.coalMineList.forEach(element => {
      if (element.saleSupplierName && saleSupplier.indexOf(element.saleSupplierName) === -1) {
        saleSupplier.push(element.saleSupplierName);
      }
    });
    response.data.saleSupplier = saleSupplier;

    if (response.data.goodsImgList) {
      response.data.goodsImgList = response.data.goodsImgList.map(el => {
        return el.imgUrl;
      });
    } else {
      response.data.goodsImgList = [];
    }
    this.detailData = response.data;
    this.goodsQuota = response.data.goodsNormList;
    this.goodsPrice = response.data.goodsPriceHistoryList;
  },
  methods: {
    onJumpChangePrice() {
      this.$router.push({
        name: 'GoodsChangePrice',
        params: {
          goodsId: this.$route.params.goodsId
        }
      });
    },
    onEditProduct() {
      this.$router.push({
        name: 'GoodsEdit',
        params: {
          goodsId: this.$route.params.goodsId
        }
      });
    },
    async onCheckPass() {
      await axios.post(api.goodsAudit, {
        goodsId: this.goodsId,
        status: 10,
        remarks: ''
      });
      this.refuseDialog.visible = false;
      this.$message.success('已通过审核');
      this.$router.push({ path: '/goods/check/list' });
    },
    async onCheckBack() {
      if (!this.refuseDialog.remarks) {
        this.$message.error('请填写拒绝理由');
        return;
      }
      await axios.post(api.goodsAudit, {
        goodsId: this.goodsId,
        status: 20,
        auditReason: this.refuseDialog.remarks
      });
      this.refuseDialog.visible = false;
      this.$message.success('已拒绝');
      this.$router.push({ path: '/goods/check/list' });
    },
    onLowerProduct(state) {
      this.$confirm('确定要' + (state == 10 ? '上架' : '下架') + '此商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'GET',
          url: api.operateGoods,
          params: {
            goodsId: this.detailData.goodsId,
            state: state
          }
        }).then(response => {
          if (response.status == 1) {
            this.$message.error(response.messsage);
            return;
          }
          this.$message.success('商品已成功' + (state == 10 ? '上架' : '下架'));
          this.init();
        });
      });
    }
  }
};
</script>
