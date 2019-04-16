<template>
  <div class="segment goods-detail-quota-segment" id="goods-quota">
    <div class="segment-header">技术指标</div>
    <div class="segment-area">
      <el-row class="h-auto">
        <el-col :span="12">
          <div class="quota-item-row">
            <div class="quota-item-icon">
              <img src="../assets/img/qkcal.png" />
            </div>
            <div class="quota-item-text">
              <div class="quota-label">热值(Q,kCal)</div>
              <div class="quota-content">
                {{ normData.goodskCal1 | toFixed(2) }} - {{ normData.goodskCal2 | toFixed(2) }}
              </div>
            </div>
          </div>
          <div class="quota-item-row">
            <div class="quota-item-icon">
              <img src="../assets/img/qm.png" />
            </div>

            <div class="quota-item-text">
              <div class="quota-label">全水分(M,%)</div>
              <div class="quota-content">
                {{ normData.goodsM1 | toFixed(2) }} - {{ normData.goodsM2 | toFixed(2) }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="quota-item-row">
            <div class="quota-item-icon">
              <img src="../assets/img/qst.png" />
            </div>
            <div class="quota-item-text">
              <div class="quota-label">硫份(St,%)</div>
              <div class="quota-content">
                {{ normData.goodsSt1 | toFixed(2) }} - {{ normData.goodsSt2 | toFixed(2) }}
              </div>
            </div>
          </div>
          <div class="quota-item-row">
            <div class="quota-item-icon">
              <img src="../assets/img/qa.png" />
            </div>
            <div class="quota-item-text">
              <div class="quota-label">灰分(A,%)</div>
              <div class="quota-content">
                {{ normData.goodsA1 | toFixed(2) }} - {{ normData.goodsA2 | toFixed(2) }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="segment-label">粘结指数(G)</div>
          <div class="segment-content">
            {{ normData.goodsG1 | toFixed(2) }} - {{ normData.goodsG2 | toFixed(2) }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="segment-label">胶质层最大厚度(Y,mm)</div>
          <div class="segment-content">
            <span v-if="normData.goodsY1 || normData.goodsY1 === 0">{{
              normData.goodsY1 | toFixed(2)
            }}</span>
            <span v-else>-</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="segment-label">固定碳含量(F Cd,%)</div>
          <div class="segment-content">
            {{ normData.goodsFC1 | toFixed(2) }} - {{ normData.goodsFC2 | toFixed(2) }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="segment-label">挥发分(V,%)</div>
          <div class="segment-content">
            {{ normData.goodsV1 | toFixed(2) }} - {{ normData.goodsV2 | toFixed(2) }}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="segment-label">灰熔点(℃)</div>
          <div class="segment-content">{{ normData.goodsC1 || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <div class="segment-label">哈氏可磨(HGI)</div>
          <div class="segment-content">{{ normData.goodsHGI1 || '-' }}</div>
        </el-col>
      </el-row>
      <el-row class="h-auto" style="padding:0px 28px">
        <el-col :span="12">
          <div class="segment-label">颗粒度</div>
          <div class="segment-content">
            <span v-if="normData.goodsDC1">{{ normData.goodsDC1 }}</span>
            <span v-else>-</span>
          </div>
        </el-col>
        <el-col :span="12" class="segment-item-warp memowarp">
          <div class="segment-label">其他</div>
          <div class="segment-content">{{ normData.goodsOther1 || '-' }}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import utils from '@/utils/utils';

import noproimg from '@/assets/img/pro-img-no.png';

export default {
  props: {
    goodsQuota: {
      type: Array,
      required: true,
      default: function() {
        return [];
      }
    }
  },
  data: function() {
    return {
      DClabelArr: [],
      normData: {}
    };
  },
  watch: {
    goodsQuota: function(newValue, oldValue) {
      this.initNormData(newValue);
    }
  },
  computed: {},
  created() {},
  methods: {
    async initNormData(goodsNormList) {
      let normData = {};
      if (this.DClabelArr && this.DClabelArr.length === 0) {
        this.DClabelArr = await utils.getSysdict('DC');
      }
      goodsNormList.forEach(element => {
        // 下拉选项 选中值是个对象 需要遍历原始指标数组取得选中值label
        if (element.normCode == 'DC') {
          normData['goods' + element.normCode + '1'] = this.DClabelArr[element.value1 - 1].label;
        } else {
          normData['goods' + element.normCode + '1'] = element.value1;
          normData['goods' + element.normCode + '2'] = element.value2 || '';
        }
      });
      this.normData = normData;
    }
  }
};
</script>
<style lang="postcss" scoped>
@import '../assets/css/common/theme.css';
.goods-detail-quota-segment {
  .segment-label {
    width: 150px;
    padding-right: 40px;
    padding-left: 25px;
    color: var(--base-label-color);
  }
  .segment-item-warp .segment-content {
    padding-left: 215px;
  }
  .quota-item-row {
    position: relative;
    padding-left: 20px;
    margin-bottom: 20px;
    height: 46px;
  }
  .quota-item-icon {
    width: 46px;
    height: 46px;
    margin-right: 30px;
    position: absolute;
    top: 0;
  }
  .quota-item-icon img {
    width: 100%;
  }
  .quota-item-text {
    padding-left: 60px;
    line-height: 1.5;
    height: 46px;
  }
  .quota-label {
    color: var(--base-label-color);
  }
  .quota-content {
    font-size: 18px;
  }
}
</style>
