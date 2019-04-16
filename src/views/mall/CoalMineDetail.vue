<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>煤矿列表</el-breadcrumb-item>
      <el-breadcrumb-item>煤矿详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-hander-panel">
      <span class="font-label">煤矿名称：</span>
      <span class="font-default">{{ detailData.coalMineName }}</span>

      <el-button class="ml-20" type="primary" @click="onJumpBack">返回列表</el-button>
    </div>
    <!-- 煤矿信息 -->
    <div class="segment merchant-detail-segment">
      <div class="segment-header">煤矿信息</div>
      <div class="segment-area">
        <el-row>
          <el-col :span="12" class="segment-item-ellipsis">
            <div class="segment-label">煤矿名称</div>
            <div class="segment-content" :title="detailData.coalMineName">
              {{ detailData.coalMineName }}
            </div>
          </el-col>
          <el-col :span="12" class="segment-item-ellipsis">
            <div class="segment-label">煤矿地址</div>
            <div
              class="segment-content"
              :title="
                `${detailData.provinceName} ${detailData.cityName} ${detailData.areaName} ${
                  detailData.address
                }`
              "
            >
              <span>{{ detailData.provinceName }} </span>
              <span>{{ detailData.cityName }} </span>
              <span v-if="detailData.areaName">{{ detailData.areaName }} </span>
              <span>{{ detailData.address }} </span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="segment-item-ellipsis">
            <div class="segment-label">联系人</div>
            <div class="segment-content" :title="detailData.contactPeople">
              {{ detailData.contactPeople }}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="segment-label">联系电话</div>
            <div class="segment-content">{{ detailData.contactNumber }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="segment-label">创建日期</div>
            <div class="segment-content">{{ detailData.contactPeople }}</div>
          </el-col>
          <el-col :span="12">
            <div class="segment-label">更新日期</div>
            <div class="segment-content">{{ detailData.contactPeople }}</div>
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
        </el-row>
      </div>
    </div>

    <!-- 关联供应链 -->
    <div class="segment">
      <div class="segment-header">关联供应链</div>
      <div class="segment-area">
        <div>
          <el-button class="mb-15" type="primary" plain @click="selectSupplyChainVisible = true"
            >新增关联</el-button
          >
          <conn-supply-chain
            ref="connSupplyChain"
            :sourceId="coalMineId"
            :listUrl="connSupplyChainUrl"
          ></conn-supply-chain>
        </div>
      </div>
    </div>

    <div class="mb-20">
      <el-amap
        vid="amapDemo"
        ref="myMap"
        :zoom="amap.zoom"
        :center="amap.center"
        style="height:500px;"
      >
        <el-amap-marker
          v-for="(marker, index) in amap.markers"
          :key="index"
          :position="marker.position"
          :title="marker.title"
          :content="marker.content"
          :events="marker.events"
        ></el-amap-marker>
      </el-amap>
    </div>

    <!-- 选择供应链dialog -->
    <el-dialog title="选择供应链" :visible.sync="selectSupplyChainVisible">
      <select-supply-chain
        v-if="selectSupplyChainVisible"
        ref="supplyChainSelect"
        :sourceId="coalMineId"
        :listUrl="selectSupplyChainUrl"
        @dbclick="handleSupplyChainSubmit"
      ></select-supply-chain>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSupplyChainSubmit">确 定</el-button>
        <el-button @click="selectSupplyChainVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Vue from 'vue';
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import utils from '@/utils/utils';

import ConnSupplyChain from './ConnSupplyChain'; // 关联的供应链
import SelectSupplyChain from './SelectSupplyChain'; // 选择供应链
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({ key: 'dc6f7d81b97b1e3f13fe76a55949a503' });

export default {
  components: {
    ConnSupplyChain,
    SelectSupplyChain
  },
  data: function() {
    return {
      coalMineId: '',
      isDisabled: false,
      detailData: {},
      connSupplyChainUrl: api.selectCompanyCoalMineRealtionList,
      selectSupplyChainVisible: false,
      selectSupplyChainUrl: api.selectNotCompanyCoalMineRealtionList,
      amap: {
        zoom: 8,
        center: [121.5273285, 31.21515044],
        markers: []
      }
    };
  },
  async created() {
    this.coalMineId = this.$route.params.coalMineId;
    let detailData = await axios.get(api.selectCoalMineDetail, {
      params: { companyCoalMineId: this.$route.params.coalMineId }
    });
    this.detailData = detailData.data;
    const position = [detailData.data.longitude, detailData.data.latitude];
    const marker = { position };
    this.amap.markers.push(marker);
    this.amap.center = position;
  },
  methods: {
    onJumpBack() {
      this.$router.push({ path: '/coalmine/list' });
    },
    // 新增煤矿关联供应链
    async handleSupplyChainSubmit() {
      const currentRow = this.$refs.supplyChainSelect.getCurrentRow();
      if (currentRow) {
        await axios.post(api.saveCompanyCoalMine, {
          coalMineId: this.coalMineId,
          companyId: currentRow.companyId
        });
        this.selectSupplyChainVisible = false;
        this.$message.success('关联成功');
        this.$refs.connSupplyChain.handleSearch();
      } else {
        this.$message.error('请选择一个供应链');
      }
    }
  }
};
</script>
<style>
</style>
