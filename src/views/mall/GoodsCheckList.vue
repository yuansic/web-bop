<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品审核</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="toolbar-panel">
      <div class="toolbar-item">
        <span class="item-label">发布日期</span>
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          size="small"
          value-format="yyyy-MM-dd"
          @change="handleDateChange"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <div class="toolbar-item">
        <el-input
          v-model.trim="tableOptions.keyword"
          :maxlength="20"
          size="small"
          prefix-icon="el-icon-search"
          clearable
          placeholder="商品编号、品名"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">煤矿</span>
        <el-select
          v-model="tableOptions.coalMineId"
          filterable
          clearable
          remote
          :remote-method="getCoalMineData"
          @change="onCoalMineChange"
          placeholder="请选择"
          style="width:120px;"
        >
          <el-option
            v-for="item in coalMineArr"
            :label="item.coalMineName"
            :value="item.coalMineId"
            :key="item.coalMineId"
          ></el-option>
        </el-select>
      </div>
      <div class="toolbar-item">
        <span class="item-label">煤种</span>
        <el-select
          v-model="tableOptions.goodsType"
          size="small"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <el-option
            v-for="item in goodsTypeArr"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="toolbar-item">
        <span class="item-label">状态</span>
        <el-select
          v-model="tableOptions.state"
          size="small"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <el-option
            v-for="item in stateArr"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="toolbar-item">
        <span class="item-label">热值下限</span>
        <el-select
          v-model="tableOptions.kCal"
          size="small"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <el-option
            v-for="item in kCalArr"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="toolbar-item">
        <el-button @click="handleSearch" size="small" type="primary">查询</el-button>
        <router-link to="/goodspublish">
          <el-button type="primary" v-has="'sale:goods:add'" class="ml-10">添加商品</el-button>
        </router-link>
      </div>
    </div>
    <div>
      <el-table border :data="tableData.list">
        <el-table-column type="expand" width="40">
          <template slot-scope="scope">
            <el-form label-position="left" inline>
              <el-form-item label="发布日期">
                <span>{{ scope.row.createTime.split(' ')[0] }}</span>
              </el-form-item>
              <el-form-item label="产地">
                <span v-if="scope.row.coalMineList.length === 0">-</span>
                <span v-else-if="scope.row.coalMineList.length > 1">
                  <span>{{ scope.row.coalMineList[0].cityName }}</span> 等
                  <el-popover
                    placement="top"
                    width="200"
                    popper-class="multiple-popover"
                    trigger="hover"
                  >
                    <div>
                      <div
                        v-for="(item, index) in scope.row.coalMineList"
                        :key="index"
                        class="multiple-popover-item"
                      >
                        <div class="font-size14">{{ item.cityName }}</div>
                      </div>
                    </div>
                    <span slot="reference" class="font-default pointer">{{
                      scope.row.coalMineList.length
                    }}</span>
                  </el-popover>
                  个产地</span
                >
                <span v-else>{{ scope.row.coalMineList[0].cityName }}</span>
              </el-form-item>
              <el-form-item label="煤矿">
                <span v-if="scope.row.coalMineList.length === 0">-</span>
                <span v-else-if="scope.row.coalMineList.length > 1">
                  <span>{{ scope.row.coalMineList[0].coalMineName }}</span> 等
                  <el-popover
                    placement="top"
                    width="200"
                    popper-class="multiple-popover"
                    trigger="hover"
                  >
                    <div>
                      <div
                        v-for="(item, index) in scope.row.coalMineList"
                        :key="index"
                        class="multiple-popover-item"
                      >
                        <div class="font-size14">{{ item.coalMineName }}</div>
                        <div class="font-size12 font-gray">{{ item.address }}</div>
                      </div>
                    </div>
                    <span slot="reference" class="font-default pointer">{{
                      scope.row.coalMineList.length
                    }}</span>
                  </el-popover>
                  家煤矿</span
                >
                <span v-else>{{ scope.row.coalMineList[0].coalMineName }}</span>
              </el-form-item>
              <el-form-item label="全水分">
                <span>{{ scope.row.goodsNormJson.M }}</span>
              </el-form-item>
              <el-form-item label="灰分">
                <span>{{ scope.row.goodsNormJson.A }}</span>
              </el-form-item>
              <el-form-item label="粘结指数">
                <span>{{ scope.row.goodsNormJson.G }}</span>
              </el-form-item>
              <el-form-item label="胶质层最大厚度">
                <span>{{ scope.row.goodsNormJson.Y }}</span>
              </el-form-item>
              <el-form-item label="固定碳含量">
                <span>{{ scope.row.goodsNormJson.FC }}</span>
              </el-form-item>
              <el-form-item label="挥发分">
                <span>{{ scope.row.goodsNormJson.V }}</span>
              </el-form-item>
              <el-form-item label="颗粒度">
                <span>{{ scope.row.goodsNormJson.DC || '' }}</span>
              </el-form-item>
              <el-form-item label="其他">
                <span>{{ scope.row.goodsNormJson.Other }}</span>
              </el-form-item>
              <el-form-item label="发布人">
                <span>{{ scope.row.companyUserName }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="商品编号" prop="goodsSn" min-width="110">
          <template slot-scope="scope">
            <span class="font-default pointer" @click="onJumpDetail(scope.row)">{{
              scope.row.goodsSn
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="煤种" prop="goodsTypeValue" min-width="80"></el-table-column>
        <el-table-column
          label="品名"
          min-width="170"
          prop="goodsName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="煤矿" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.coalMineList | coalMineFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="热值(kcal)" min-width="95" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.goodsNormJson.kCal }}</span>
          </template>
        </el-table-column>
        <el-table-column label="硫分(%)" min-width="95" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.goodsNormJson.St }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交货方式" prop="deliveryTypeValue" min-width="90"></el-table-column>
        <el-table-column label="坑口含税价(元/吨)" min-width="120">
          <template slot-scope="scope">{{ scope.row.price | thousands(2) }}</template>
        </el-table-column>
        <el-table-column label="价格更新日期" prop="updateTime" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已销售(吨)" prop="sellCount" min-width="95"></el-table-column>
        <el-table-column label="状态" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.state | stateFilter(stateArr) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <span class="font-default pointer" @click="onJumpDetail(scope.row)">审核</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import api from '@/api/mall.api';
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
      timeRange: [],
      coalMineArr: [],
      goodsTypeArr: [],
      stateArr: [],
      kCalArr: [],
      tableData: {}, // 表格数据
      // 工具栏筛选字段
      tableOptions: {
        goodsSource: 5,
        startTime: '',
        endTime: '',
        keyword: '',
        coalMineId: '',
        goodsType: '',
        state: ''
      },
      // 发送请求实际字段
      sendOptions: {}
    };
  },
  async created() {
    const dict = await utils.getSysdict();
    this.goodsTypeArr = dict.goodsType; // 煤种字典
    this.stateArr = dict.state; // 状态字典
    this.kCalArr = dict.kCal; // 热值下限字典

    this.getCoalMineData();
    this.handleSearch();
  },
  methods: {
    // 查询煤矿数据
    async getCoalMineData(query = '') {
      let response = await axios.post(api.selectCoalMineList, {
        pageNo: 1,
        pageSize: 20,
        coalMineName: query
      });
      response.data = response.data || {};
      this.coalMineArr = response.data.list || [];
    },
    onCoalMineChange(val) {
      if (val === '') {
        this.getCoalMineData();
      }
    },
    // 选择时间范围
    handleDateChange: function(val) {
      if (val && val.length > 0) {
        this.tableOptions.startTime = val[0];
        this.tableOptions.endTime = val[1];
      } else {
        this.tableOptions.startTime = '';
        this.tableOptions.endTime = '';
      }
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({ path: '/goodsedit/' + row.goodsId });
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确定要删除此商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'GET',
          url: api.goodsDelete,
          params: {
            goodsId: row.goodsId
          }
        }).then(response => {
          if (response.status == 0) {
            this.$message.success('删除成功');
            this.handleSearch();
          }
        });
      });
    },
    // 查看详情
    onJumpDetail(row) {
      this.$router.push({ path: '/goods/check/detail/' + row.goodsId });
    },
    async fetchData(opts) {
      const options = { pageNo: 1, pageSize: 20, ...this.sendOptions, ...opts };
      let result = await axios.post(api.goodsFindList, options);
      this.tableData = result.data;
    }
  },
  filters: {
    coalMineFilter: value => {
      const coalMineList = value || [];
      if (coalMineList.length > 0) {
        const coalMineName = coalMineList.map(el => el.coalMineName);
        return coalMineName.join(', ');
      } else {
        return '';
      }
    },
    stateFilter: (value, arr) => {
      let item = arr.filter(el => el.value.toString() === value.toString());
      item = item[0] || {};
      return item.label || '';
    }
  }
};
</script>

<style>
</style>
