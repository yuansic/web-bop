<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods/list' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-hander-panel">
      <span style="display:inline-block;min-width:370px">
        <span class="font-label">编号：</span>
        <span class="font-default">{{ detailData.goodsSn }}</span>
        <span class="font-label ml-20">发布日期：</span>
        <span>{{ detailData.createTime }}</span>
      </span>
      <el-button type="primary" @click="onModifyPrice">矿发煤价</el-button>
      <router-link to="/goods/list">
        <el-button class="ml-10">返回</el-button>
      </router-link>
    </div>
    <div class="goods-detail-component">
      <div class="goods-detail-order-form-panel cl">
        <goods-base-info :goodsInfo="detailData"></goods-base-info>
      </div>
      <goods-base-quota :goodsQuota="goodsQuota"></goods-base-quota>
      <goods-base-price :goodsPrice="goodsPrice"></goods-base-price>
    </div>
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
    // 矿发煤价
    onModifyPrice(row) {
      this.$router.push({ path: '/goods/mine/price/' + this.goodsId });
    },
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
