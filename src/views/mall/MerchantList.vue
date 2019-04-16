<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>商户管理</el-breadcrumb-item>
      <el-breadcrumb-item>商户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="toolbar-panel">
      <div class="toolbar-item">
        <span class="item-label">企业编号</span>
        <el-input
          v-model.trim="tableOptions.companyCode"
          :maxlength="20"
          clearable
          placeholder="企业编号"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">商户名称</span>
        <el-input
          v-model.trim="tableOptions.fullName"
          :maxlength="20"
          clearable
          placeholder="商户名称"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <span class="item-label">登录手机号</span>
        <el-input
          v-model.trim="tableOptions.loginAdminName"
          :maxlength="20"
          clearable
          placeholder="登录手机号"
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
        <span class="item-label">商户类型</span>
        <el-select
          v-model="tableOptions.companyType"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <el-option label="采购商" value="PURCHASE"></el-option>
          <el-option label="供应商" value="SUPPLIER"></el-option>
          <el-option label="经纪人" value="BROKER"></el-option>
          <!-- <el-option label="供应链" value="FIN"></el-option> -->
        </el-select>
      </div>
      <div class="toolbar-item">
        <span class="item-label">商户状态</span>
        <el-select
          v-model="tableOptions.status"
          clearable
          placeholder="请选择"
          style="width:120px;"
        >
          <el-option label="已停用" :value="true"></el-option>
          <el-option label="已启用" :value="false"></el-option>
        </el-select>
      </div>
      <div class="toolbar-item">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>
    <el-table :data="tableData.list" border>
      <el-table-column label="企业编号" prop="companyCode" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="font-default pointer" @click="onJumpDetail(scope.row)">{{
            scope.row.companyCode
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户名称" prop="fullName" min-width="220" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isSelf === 1" type="danger" class="mr-5">自营</el-tag>
          <span>{{ scope.row.fullName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户类型" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.companyType === 'PURCHASE'"><el-tag>采购商</el-tag></span>
          <span v-else-if="scope.row.companyType === 'SUPPLIER'"
            ><el-tag type="success">供应商</el-tag></span
          >
          <span v-else-if="scope.row.companyType === 'BROKER'"
            ><el-tag type="warning">经纪人</el-tag></span
          >
          <span v-else>供应链</span>
          <!-- FIN -->
        </template>
      </el-table-column>
      <el-table-column
        label="联系人"
        prop="contactPeople"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="登录手机号"
        prop="loginAdminName"
        min-width="110"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="商户状态" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status" class="font-red">已停用</span>
          <span v-else>已启用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <span class="font-default pointer" @click="onJumpDetail(scope.row)">详情</span>
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
        companyCode: '',
        fullName: '',
        loginAdminName: '',
        startTime: '',
        endTime: '',
        companyType: '',
        status: ''
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
        companyCode: '',
        fullName: '',
        loginAdminName: '',
        companyType: '',
        status: '',
        startTime: '',
        endTime: ''
      };
      this.timeRange = '';
      this.handleSearch();
    },
    // 绑定自营供应商
    async onBindThisSupply(row) {
      await axios.post(api.saveCompanyRelationship, {
        targetId: '8e544cc70d8b43afb396ccc55f789894',
        sourceId: row.companyId
      });
      this.$message.success('绑定成功');
    },
    onJumpDetail(row) {
      this.$router.push({ path: '/merchant/detail/' + row.companyId });
    },
    async fetchData(opts) {
      const options = { pageNo: 1, pageSize: 20, ...this.sendOptions, ...opts };
      let result = await axios.post(api.companyList, options);
      this.tableData = result.data;
    }
  }
};
</script>
