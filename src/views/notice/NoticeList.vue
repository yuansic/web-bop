<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>消息通知</el-breadcrumb-item>
      <el-breadcrumb-item>系统消息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="toolbar-panel">
      <div class="toolbar-item">
        <el-input
          v-model.trim="tableOptions.keyword"
          :maxlength="20"
          clearable
          prefix-icon="el-icon-search"
          style="width: 260px"
          placeholder="消息内容"
        ></el-input>
      </div>
      <div class="toolbar-item">
        <el-button type="primary" @click="search" size="small">筛选</el-button>
        <el-button @click="onMarkerReadBatch">标记为已读</el-button>
        <el-button @click="onMarkerReadAll">全部标记为已读</el-button>
      </div>
    </div>
    <el-table :data="tableData.list" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"> </el-table-column>
      <el-table-column label="标题" prop="title" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.title">{{ scope.row.title }}</span>
          <span v-else>新消息</span>
        </template>
      </el-table-column>
      <el-table-column
        label="内容"
        prop="content"
        min-width="350"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="消息类型" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 'SYSTEM'">系统消息</span>
          <span v-else>系统消息</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.messageStatus == 'UNREAD'" class="font-orange">未读</span>
          <span v-else class="font-green">已读</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <span
            class="font-default pointer"
            v-if="scope.row.messageStatus == 'UNREAD'"
            @click="onMarkerRead(scope.row)"
            >标为已读</span
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-fix">
      <el-pagination
        :page-size="20"
        :current-page.sync="page"
        :total="tableData.count"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/notice.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';

export default {
  mixins: [listMixin],
  data() {
    return {
      tableOptions: {},
      sendOptions: {},
      tableData: {},
      multipleSelection: []
    };
  },
  created() {
    this.search();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 标记已读
    async onMarkerRead(row) {
      let result = await axios.post(api.sysMsgRead, { messageIds: [row.messageId] });
      this.$message.success('标记成功');
      this.search();
    },
    // 标记已读 批量
    async onMarkerReadBatch() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选需要标记的消息');
        return;
      }
      const messageIds = this.multipleSelection.map(element => element.messageId);
      let result = await axios.post(api.sysMsgRead, { messageIds: messageIds });
      this.$message.success('标记成功');
      this.search();
    },
    // 标记已读 全部
    async onMarkerReadAll() {
      let result = await axios.get(api.sysMsgAllRead);
      this.$message.success('标记成功');
      this.search();
    },
    axiosRequest(opts) {
      var options = { page: 1, limit: 20, ...this.sendOptions, ...opts };
      options.all = 0;
      axios({
        method: 'POST',
        url: api.sysMsgList,
        data: options
      }).then(response => {
        this.checkNodata(response, false);
        this.tableData = response.data;
      });
    }
  }
};
</script>
