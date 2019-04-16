<template>
  <div class="segment goods-detail-info-segment" id="goods-info">
    <div class="segment-header">商品信息</div>
    <div class="segment-area">
      <div class="mb-20">
        <div class="goods-detail-info-title">
          <span class="mr-10">{{ goodsInfo.goodsTypeValue }}</span>
          <span class="mr-10">{{ goodsInfo.goodsName }}</span>
          <span
            >{{ normData.goodskCal1 | toFixed(2) }} -
            {{ normData.goodskCal2 | toFixed(2) }} 大卡</span
          >
        </div>
      </div>
      <el-row>
        <el-col>
          <div class="segment-label">煤矿</div>
          <div class="segment-content">
            <span v-if="goodsInfo.coalMineList.length === 0">-</span>
            <span v-else-if="goodsInfo.coalMineList.length === 1">{{
              goodsInfo.coalMineList[0].coalMineName
            }}</span>
            <span v-else>
              <span>{{ goodsInfo.coalMineList[0].coalMineName }}</span> 等
              <el-popover
                placement="top"
                width="200"
                popper-class="multiple-popover"
                trigger="hover"
              >
                <div>
                  <div
                    v-for="(item, index) in goodsInfo.coalMineList"
                    :key="index"
                    class="multiple-popover-item"
                  >
                    <div class="font-size14">{{ item.coalMineName }}</div>
                    <div class="font-size12 font-gray">{{ item.address }}</div>
                  </div>
                </div>
                <span slot="reference" class="font-default pointer">{{
                  goodsInfo.coalMineList.length
                }}</span>
              </el-popover>
              家煤矿
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="segment-label">库存</div>
          <div class="segment-content">{{ goodsInfo.number | toFixed(2) }} 吨</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="segment-label">价格更新日期</div>
          <div class="segment-content">{{ goodsInfo.updateTime }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="segment-label">产地</div>
          <div class="segment-content">
            <span v-if="goodsInfo.coalMineList.length === 0">-</span>
            <span v-else-if="goodsInfo.coalMineList.length === 1">{{
              goodsInfo.coalMineList[0].cityName
            }}</span>
            <span v-else>
              <span>{{ goodsInfo.coalMineList[0].cityName }}</span> 等
              <el-popover
                placement="top"
                width="200"
                popper-class="multiple-popover"
                trigger="hover"
              >
                <div>
                  <div
                    v-for="(item, index) in goodsInfo.coalMineList"
                    :key="index"
                    class="multiple-popover-item"
                  >
                    <div class="font-size14">{{ item.cityName }}</div>
                  </div>
                </div>
                <span slot="reference" class="font-default pointer">{{
                  goodsInfo.coalMineList.length
                }}</span>
              </el-popover>
              个产地
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="segment-label">交货方式</div>
          <div class="segment-content">一票到站</div>
        </el-col>
      </el-row>
      <el-row class="h-auto">
        <el-col class="segment-item-warp memowarp">
          <div class="segment-label">付款方式</div>
          <div class="segment-content">
            <div v-for="(item, index) in goodsInfo.goodsPlanList" :key="index">
              <span v-if="goodsInfo.goodsPlanList.length > 1">{{ index + 1 }}、</span>
              {{ item.deliveryPayTypeValue }}； 坑口含税价:
              <span class="font-orange">{{ item.price | thousands(2) }}</span
              >(元/吨)
            </div>
            <a href="./static/payprocess.html" target="blank">
              <el-button type="text" size="medium">
                <i class="el-icon-info font-orange mr-5"></i>查看付款说明
              </el-button>
            </a>
          </div>
        </el-col>
      </el-row>
      <el-row class="h-auto">
        <el-col class="segment-item-warp memowarp">
          <span class="segment-label">商品备注</span>
          <span class="segment-content">{{ goodsInfo.remark || '-' }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <span class="segment-label">检测机构</span>
          <span class="segment-content">{{ goodsInfo.testingOrganization || '-' }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span class="segment-label">检测日期</span>
          <span class="segment-content">{{ goodsInfo.testingDate | timesplit }}</span>
        </el-col>
      </el-row>
      <el-row class="h-auto" v-if="goodsInfo.goodsImgList.length > 0">
        <el-col :span="24" class="segment-item-warp imgwarp">
          <span class="segment-label">&nbsp;</span>
          <div class="segment-content">
            <div
              v-for="(url, index) in goodsInfo.goodsImgList"
              :key="index"
              class="preview-grid mt-10"
            >
              <div
                class="preview-grid-img"
                title="点击查看大图"
                :style="{ backgroundImage: 'url(' + url + ')' }"
                @click="showImgDialog(url)"
              ></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 图片dialog -->
    <el-dialog :visible.sync="showImgObj.show" class="preview-img">
      <img width="100%" :src="showImgObj.imgUrl" />
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import utils from '@/utils/utils';

import noproimg from '@/assets/img/pro-img-no.png';

export default {
  props: {
    goodsInfo: {
      type: Object,
      required: true,
      default: function() {
        return {
          goodsPlanList: [],
          goodsImgList: []
        };
      }
    }
  },
  data: function() {
    return {
      normData: {},
      DClabelArr: [],
      showImgObj: {
        show: false,
        imgUrl: ''
      }
    };
  },
  computed: {},
  watch: {
    'goodsInfo.goodsNormList': async function(newValue, oldValue) {
      if (this.DClabelArr && this.DClabelArr.length === 0) {
        let dict = await utils.getSysdict('DC');
        this.DClabelArr = dict;
      }
      this.initNormData(newValue);
    }
  },
  created() {},
  mounted() {},
  methods: {
    initNormData(goodsNormList) {
      let normData = {};
      goodsNormList.forEach(element => {
        // 下拉选项 选中值是个对象 需要遍历原始指标数组取得选中值label
        if (element.normCode == 'DC') {
          normData['goods' + element.normCode + '1'] = this.DClabelArr[element.value1 - 1];
        } else {
          normData['goods' + element.normCode + '1'] = element.value1;
          normData['goods' + element.normCode + '2'] = element.value2 || '';
        }
      });
      this.normData = normData;
    },
    showImgDialog(imgUrl) {
      if (!imgUrl) return;
      this.showImgObj.show = true;
      this.showImgObj.imgUrl = imgUrl;
    }
  }
};
</script>
<style lang="postcss" scoped>
@import '../assets/css/common/theme.css';
.goods-detail-info-segment {
  margin-bottom: 0;
  flex: 1 1 auto;
  .el-row {
    height: 42px;
    line-height: 42px;
  }
  .goods-detail-info-title {
    font-size: 20px;
    color: #333;
    font-weight: 400;
    margin-left: 28px;
  }
}
</style>
