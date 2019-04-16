<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods/list' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>矿发煤价</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="toolbar-panel">
      <div class="toolbar-item">
        <span class="item-label">生效时间</span>
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          :clearable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="handleDateChange"
          :picker-options="pickerOptions"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </div>
      <div class="toolbar-item">
        <el-button @click="handleSearch" type="primary">查询</el-button>
        <el-button @click="onAddMinePrice" type="primary">新增煤价</el-button>
        <router-link to="/goods/list">
          <el-button class="ml-10">返回</el-button>
        </router-link>
      </div>
    </div>
    <div>
      <el-table border :data="tableData.list">
        <el-table-column label="商品编号" prop="goodsSn" min-width="110">
          <template slot-scope="scope">
            <span class="font-default pointer">{{ scope.row.goodsSn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="goodsTypeValue" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="矿发煤价" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="font-orange">{{ scope.row.goodsMinePrice | thousands(2) }} 元</span>
          </template>
        </el-table-column>
        <el-table-column label="生效日期" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.goodsMineTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="statusValue" min-width="120"></el-table-column>
        <el-table-column label="最后编辑时间" prop="updateTime" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <span class="font-red pointer ml-5" v-has="'23423423'" @click="handleDelete(scope.row)"
              >删除</span
            >
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

    <!-- 煤价维护dialog -->
    <el-dialog title="新增矿发煤价" :visible.sync="priceVisible" width="500px">
      <el-form :model="priceForm" ref="priceForm" :rules="priceRules" label-width="120px">
        <el-form-item label="矿发煤价" prop="price" :rules="priceRules.price">
          <el-input
            v-model="priceForm.price"
            placeholder="请输入矿发煤价"
            autocomplete="off"
            :maxlength="10"
            style="width:220px"
          ></el-input>
        </el-form-item>
        <el-form-item label="生效日期" prop="goodsMineTime">
          <el-date-picker
            v-model="priceForm.goodsMineTime"
            type="datetime"
            popper-class="price-time-input"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="pickerDefaultTime"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="priceVisible = false">取 消</el-button>
        <el-button type="primary" @click="onPriceSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import utils from '@/utils/utils';
import Validator from '@/utils/Validator';
import listMixin from '@/utils/listMixin';

export default {
  mixins: [listMixin],
  data() {
    var validatePrice = (rule, value, callback) => {
      if (!Validator.isNumber(value, false, 2)) {
        return callback(new Error(rule.message));
      } else {
        callback();
      }
    };
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      timeRange: [utils.get30BeforeAfter().startTime, utils.get30BeforeAfter().endTime],
      stateArr: [],
      tableData: {}, // 表格数据
      // 工具栏筛选字段
      tableOptions: {
        goodsId: '',
        goodsMineTimeStart: utils.get30BeforeAfter().startTime,
        goodsMineTimeEnd: utils.get30BeforeAfter().endTime
      },
      // 发送请求实际字段
      sendOptions: {},
      priceVisible: false,
      priceForm: {
        price: '',
        goodsMineTime: ''
      },
      priceRules: {
        price: [
          { required: true, message: '请输入坑口含税价', trigger: 'blur' },
          { validator: validatePrice, message: '最多2位小数的数字', trigger: 'blur' }
        ],
        goodsMineTime: [{ required: true, message: '请选择生效日期', trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerDefaultTime: ''
    };
  },
  async created() {
    this.tableOptions.goodsId = this.$route.params.goodsId || '';
    const dict = await utils.getSysdict();

    this.goodsTypeArr = dict.goodsType; // 煤种字典
    this.stateArr = dict.state; // 状态字典
    this.kCalArr = dict.kCal; // 热值下限字典

    this.handleSearch();
  },
  methods: {
    // 选择时间范围
    handleDateChange: function(val) {
      if (val && val.length > 0) {
        this.tableOptions.goodsMineTimeStart = val[0];
        this.tableOptions.goodsMineTimeEnd = val[1];
      } else {
        this.tableOptions.goodsMineTimeStart = '';
        this.tableOptions.goodsMineTimeEnd = '';
      }
    },
    onAddMinePrice() {
      this.priceForm.price = '';
      this.priceForm.goodsMineTime = '';
      this.priceVisible = true;
      Vue.nextTick(() => {
        this.$refs.priceForm.clearValidate();
      });
    },
    onPriceSubmit() {
      this.$refs.priceForm.validate(async valid => {
        if (valid) {
          const goodsMineTime = this.priceForm.goodsMineTime.replace(/\-/g, '/');
          if (new Date(goodsMineTime).getTime() < Date.now()) {
            this.$message.error('生效时间已过期，请重新选择');
            return;
          }
          let res = await axios.post(api.saveGoodsMinePrice, {
            goodsId: this.tableOptions.goodsId,
            goodsMinePrice: this.priceForm.price,
            goodsMineTime: this.priceForm.goodsMineTime,
            goodsSn: this.tableOptions.goodsSn
          });
          this.$message.success('操作成功');
          this.priceVisible = false;
          this.handleSearch();
        }
      });
    },
    // 查看详情
    onJumpDetail(row) {
      this.$router.push({ path: '/goods/detail/' + row.goodsId });
    },
    async fetchData(opts) {
      const options = { pageNo: 1, pageSize: 20, ...this.sendOptions, ...opts };
      let result = await axios.post(api.selectGoodsMinePrice, options);
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
handleDateChange
