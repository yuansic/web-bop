<template>
  <div class="coalmina-select-dialog-page">
    <div class="select-page-content">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">煤矿名称</span>
          <el-input
            clearable
            :maxlength="20"
            v-model="tableOptions.coalMineName"
            prefix-icon="el-icon-search"
            placeholder="请输入关键字查询"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
      </div>
      <el-table
        :data="tableData.list"
        highlight-current-row
        @current-change="handleCurrentRowChange"
        @row-dblclick="handleRowDbclick"
        border
      >
        <el-table-column
          label="煤矿名称"
          prop="coalMineName"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="联系人" prop="contactPeople" min-width="110" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="联系电话" prop="contactNumber" min-width="100"> </el-table-column>
        <el-table-column label="煤矿地址" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.provinceName }} </span>
            <span>{{ scope.row.cityName }} </span>
            <span v-if="scope.row.areaName">{{ scope.row.areaName }} </span>
            <span>{{ scope.row.address }} </span>
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
import api from '@/api/mall.api.js';
import listMixin from '@/utils/listMixin';

export default {
  mixins: [listMixin],
  props: {
    companyId: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      currentRow: null,
      tableOptions: {
        companyId: '',
        coalMineName: ''
      },
      sendOptions: {},
      tableData: []
    };
  },
  created() {
    this.tableOptions.companyId = this.companyId;
    this.handleSearch();
  },
  methods: {
    getCurrentRow() {
      return this.currentRow;
    },
    handleCurrentRowChange(val) {
      this.currentRow = val;
    },
    handleRowDbclick() {
      this.$emit('dbclick');
    },
    async fetchData(opts) {
      const options = { pageNo: 1, pageSize: 20, ...this.sendOptions, ...opts };
      let result = await axios.post(api.selectNotCompanyCoalMineList, options);
      this.tableData = result.data;
    }
  }
};
</script>
<style lang="postcss" scoped>
.coalmina-select-dialog-page {
  position: relative;
  padding-bottom: 40px;
  .select-page-content {
    height: 340px;
    overflow-y: auto;
  }
  /deep/ .el-table__body tr {
    cursor: pointer;
  }
  /deep/ .el-table--enable-row-hover .el-table__body tr.current-row:hover > td {
    background-color: #b6d6f3;
  }
  .pagination-fix {
    bottom: 0;
  }
}
</style>
