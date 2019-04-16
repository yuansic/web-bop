<template>
  <div class="conn-supply-chain-page">
    <el-table :data="tableData.list">
      <el-table-column
        label="供应链名称"
        prop="fullName"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="联系人" prop="contactPeople" min-width="110"> </el-table-column>
      <el-table-column label="联系电话" prop="contactNumber" min-width="100"> </el-table-column>
      <el-table-column
        label="联系地址"
        prop="contactAddress"
        min-width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <span class="font-red pointer" @click="onDeleteCoalmine(scope.row)"></span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-fix"
      :page-size="pageSize"
      :current-page.sync="pageNo"
      :total="tableData.count"
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import utils from '@/utils/utils';
import listMixin from '@/utils/listMixin';

export default {
  // listUrl 1经纪人查询关联的供应链列表 2煤矿查询关联的供应链列表
  // sourceId 1经纪人id 2煤矿id
  mixins: [listMixin],
  props: {
    sourceId: {
      type: String,
      required: true
    },
    listUrl: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      tableOptions: {
        companyType: 'SUPPLIER',
        sourceId: '',
        fullName: ''
      },
      sendOptions: {},
      tableData: {} // 已关联的供应链列表
    };
  },
  async created() {
    this.tableOptions.sourceId = this.sourceId;
    this.handleSearch();
  },
  methods: {
    getRowLength() {
      return this.tableData.count || 0;
    },
    // 删除供应链关联
    async onDeleteCoalmine(row) {
      await axios.post(api.deleteCompanyCoalMine, {
        coalMineId: row.coalMineId,
        companyId: row.companyId,
        companyCoalMineId: row.companyCoalMineId
      });
      this.handleSearch();
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
.conn-supply-chain-page {
  min-height: 200px;
  position: relative;
  padding-bottom: 40px;
  /deep/ .el-table__header tr th {
    background: #fff;
    border-right: none;
  }
  /deep/ .el-table th.is-leaf .cell {
    font-weight: bold;
  }
}
</style>
