<template>
  <div class="supplychain-select-dialog-page">
    <div class="select-page-content">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">供应链名称</span>
          <el-input
            clearable
            :maxlength="20"
            v-model="tableOptions.fullName"
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
          label="供应链名称"
          prop="fullName"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="联系人" prop="contactPeople" min-width="110" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="联系电话" prop="contactNumber" min-width="100"> </el-table-column>
        <el-table-column
          label="联系地址"
          prop="contactAddress"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
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
  // listUrl 1经纪人查询关联的供应链列表 2煤矿查询关联的供应链列表
  // sourceId 1经纪人id 2煤矿id
  mixins: [listMixin],
  props: {
    sourceId: {
      type: String,
      required: false
    },
    listUrl: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      currentRow: null,
      tableOptions: {
        companyType: 'FIN',
        sourceId: '',
        fullName: ''
      },
      sendOptions: {},
      tableData: []
    };
  },
  created() {
    this.tableOptions.sourceId = this.sourceId;
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
      let result = await axios.post(this.listUrl, options);
      this.tableData = result.data;
    }
  }
};
</script>
<style lang="postcss" scoped>
.supplychain-select-dialog-page {
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
