<template>
  <div class="conn-coal-mine-page">
    <el-table :data="tableData.list">
      <el-table-column
        label="煤矿名称"
        prop="coalMineName"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="联系人" prop="contactPeople" min-width="110"> </el-table-column>
      <el-table-column label="联系电话" prop="contactNumber" min-width="100"> </el-table-column>
      <el-table-column label="煤矿地址" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.provinceName }} </span>
          <span>{{ scope.row.cityName }} </span>
          <span v-if="scope.row.areaName">{{ scope.row.areaName }} </span>
          <span>{{ scope.row.address }} </span>
        </template>
      </el-table-column>
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
  mixins: [listMixin],
  props: {
    companyId: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      tableOptions: {
        companyId: '',
        companyName: ''
      },
      sendOptions: {},
      tableData: {} // 已关联的煤矿列表
    };
  },
  async created() {
    this.tableOptions.companyId = this.companyId;
    this.handleSearch();
  },
  methods: {
    // 删除煤矿关联
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
      let result = await axios.post(api.selectCompanyCoalMineList, options);
      this.tableData = result.data;
    }
  }
};
</script>
<style lang="postcss" scoped>
.conn-coal-mine-page {
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
