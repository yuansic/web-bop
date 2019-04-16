<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>商户管理</el-breadcrumb-item>
      <el-breadcrumb-item>商户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="toolbar-panel">
      <div class="toolbar-item">
        <span class="item-label">煤矿名称</span>
        <el-input
          v-model.trim="tableOptions.coalMineName"
          :maxlength="20"
          clearable
          placeholder="煤矿名称"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">联系人</span>
        <el-input
          v-model.trim="tableOptions.contactPeople"
          :maxlength="20"
          clearable
          placeholder="联系人"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">联系电话</span>
        <el-input
          v-model.trim="tableOptions.contactNumber"
          :maxlength="20"
          clearable
          placeholder="联系电话"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">创建时间</span>
        <el-date-picker
          v-model="timeRange"
          value-format="yyyy-MM-dd"
          @change="handleDateChange"
          :picker-options="pickerOptions"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </div>

      <div class="toolbar-item">
        <span class="item-label">煤矿状态</span>
        <el-select
          v-model="tableOptions.isDelete"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <el-option label="已停用" :value="1"></el-option>
          <el-option label="已启用" :value="0"></el-option>
        </el-select>
      </div>
      <div class="toolbar-item">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>
    <el-table :data="tableData.list" border>
      <el-table-column label="煤矿名称" prop="coalMineName" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="font-default pointer" @click="onJumpDetail(scope.row)">{{
            scope.row.coalMineName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系人"
        prop="contactPeople"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="联系电话"
        prop="contactNumber"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="煤矿地址" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.provinceName }} </span>
          <span>{{ scope.row.cityName }} </span>
          <span v-if="scope.row.areaName">{{ scope.row.areaName }} </span>
          <span>{{ scope.row.address }} </span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | timesplit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="煤矿状态" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete" class="font-orange">已停用</span>
          <span v-else class="font-green">已启用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <span class="font-default pointer" @click="onJumpDetail(scope.row)"></span>
        </template>
      </el-table-column>
    </el-table>
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
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';

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
      tableOptions: {
        coalMineName: '',
        contactPeople: '',
        contactNumber: '',
        startTime: '',
        endTime: '',
        isDelete: ''
      },
      sendOptions: {},
      tableData: {}
    };
  },
  created() {
    this.handleSearch();
  },
  methods: {
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
    handleReset() {
      this.tableOptions = {
        coalMineName: '',
        contactPeople: '',
        contactNumber: '',
        startTime: '',
        endTime: '',
        isDelete: ''
      };
      this.timeRange = '';
      this.handleSearch();
    },
    // 绑定自营供应商
    async onBindThisSupply(row) {
      await axios.post(api.saveCompanyRelationship, {
        targetId: 'ee9337157c524b679db1ebc0c018e1ce',
        sourceId: row.companyId
      });
      this.$message.success('绑定成功');
    },
    onJumpDetail(row) {
      this.$router.push({ path: '/coalmine/detail/' + row.coalMineId });
    },
    async fetchData(opts) {
      const options = { pageNo: 1, pageSize: 20, ...this.sendOptions, ...opts };
      let result = await axios.post(api.selectCoalMineList, options);
      this.tableData = result.data;
    }
  }
};
</script>
