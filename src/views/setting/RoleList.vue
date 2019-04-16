<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button
      type="primary"
      class="mr-10 mb-10"
      size="small"
      v-has="'setting:sys:role:add'"
      @click="onAddRole"
      >添加角色</el-button
    >
    <el-table :data="tableData.list" border>
      <el-table-column
        label="角色名称"
        prop="name"
        min-width="210"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="英文名称"
        prop="enname"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="归属机构" prop="name" min-width="210" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>总公司</span>
          <span v-if="scope"></span>
        </template>
      </el-table-column>
      <el-table-column label="数据范围" prop="name" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.dataScope === '0'">个人数据</span>
          <span v-else>所有数据</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="useable" min-width="150">
        <template slot-scope="scope">
          <span class="font-green" v-if="scope.row.useable === '1'">启用</span>
          <span class="font-red" v-else>禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <i
            title="查看"
            v-has="'setting:sys:role:view'"
            class="el-icon-document font-size20 pointer font-default mr-10"
            @click="onViewRole(scope.row)"
          ></i>
          <i
            title="编辑"
            class="el-icon-edit font-size20 pointer font-default mr-10"
            @click="onEditRole(scope.row)"
          ></i>
          <i
            title="删除"
            v-has="'setting:sys:role:del'"
            class="el-icon-delete font-size20 pointer font-red"
            @click="onDeleteRole(scope.row.id)"
          ></i>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="isDelete" width="400px">
      <span>确定删除该角色？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="onConfirmDelete">确 定</el-button>
      </span>
    </el-dialog>
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
import api from '@/api/setting.api';
import utils from '@/utils/utils';
import Permission from '@/utils/permission';
import listMixin from '@/utils/listMixin';

export default {
  mixins: [listMixin],
  data() {
    return {
      tableOptions: {
        roleName: ''
      },
      sendOptions: {},
      tableData: {},
      isDelete: false,
      roleId: '', //删除的角色id
      isAdmin: ''
    };
  },
  created() {
    const userData = utils.getLocalItem('userData');
    if (userData) {
      this.isAdmin = userData.isAdmin || false;
    }
    this.handleSearch();
  },

  methods: {
    onViewRole(row) {
      // 查看角色权限
      this.$router.push({ name: 'RoleView', params: { id: row.id } });
    },
    onAddRole() {
      //添加角色
      this.$router.push({ path: '/role/add' });
    },
    onEditRole(row) {
      //编辑角色
      this.$router.push({ name: 'RoleEdit', params: { id: row.id } });
    },
    onDeleteRole(roleId) {
      //删除角色
      this.isDelete = true;
      this.roleId = roleId;
    },
    async onConfirmDelete() {
      this.isDelete = false;
      //确定删除
      let response = await axios.post(api.deleteSysRoleInfo, { id: this.roleId });
      this.$message.success('删除成功');

      // 修改权限后 重新获取权限
      let result = await Permission.getPermission({
        silence: false, // 是否静默加载
        backself: false // 请求出错不用返回
      });
      // 修改state
      await this.$store.dispatch('changeMenuTree', result.menuTree);
      await this.$store.dispatch('changePermission', result.permissionList);

      location.reload();
    },
    async fetchData(opts) {
      const options = { pageNo: 1, pageSize: 20, ...this.sendOptions, ...opts };
      let result = await axios.post(api.querySysRoleList, options);
      this.tableData = result.data;
    }
  }
};
</script>
