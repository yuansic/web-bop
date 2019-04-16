<template>
  <div class="menumng-page">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="toolbar-panel">
      <div class="toolbar-item">
        <el-button type="primary" @click="onAddMenu" v-has="'setting:sys:menu:add'"
          >添加菜单</el-button
        >
      </div>
    </div>
    <div class="menu-tree-table">
      <div class="tree-th-header">
        <span class="tree-th-name">名称</span>
        <span class="tree-th-content">
          <el-row class="tree-th">
            <el-col :span="5">链接</el-col>
            <el-col :span="2">排序</el-col>
            <el-col :span="2">默认</el-col>
            <el-col :span="4">图标</el-col>
            <el-col :span="5">权限标识</el-col>
            <el-col :span="6">操作</el-col>
          </el-row>
        </span>
      </div>
      <el-tree
        :data="treeNode"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        ref="tree"
        highlight-current
        :filter-node-method="filterNode"
        :props="defaultProps"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="custom-node-name">{{ data.name }}</span>
          <span class="custom-node-content">
            <el-row>
              <el-col :span="5" :title="data.href">
                <span>{{ data.href || '-' }}</span>
              </el-col>
              <el-col :span="2">
                <span>{{ data.sort || '-' }}</span>
              </el-col>
              <el-col :span="2">
                <span v-if="data.isDefault === '1'">是</span>
                <span v-else>否</span>
              </el-col>
              <el-col :span="4" :title="data.icon">
                <span>{{ data.icon || '-' }}</span>
              </el-col>
              <el-col :span="5" :title="data.permission">
                <span>{{ data.permission || '-' }}</span>
              </el-col>
              <el-col :span="6">
                <span>
                  <el-button
                    type="text"
                    size="mini"
                    v-has="'setting:sys:menu:edit'"
                    @click="onEditMenu(data)"
                  >
                    修改
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    v-has="'setting:sys:menu:del'"
                    @click.stop="onDelMenu(data)"
                  >
                    删除
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    v-has="'setting:sys:menu:add'"
                    @click="onAddSubMenu(data)"
                  >
                    添加下级菜单
                  </el-button>
                </span>
              </el-col>
            </el-row>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api';
import Permission from '@/utils/permission';

export default {
  data() {
    return {
      treeNode: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultKeys: []
    };
  },
  created() {
    this.initTree();
  },
  methods: {
    async initTree() {
      let result = await axios.post(api.queryAllMenuListTree, {});
      this.treeNode = result.data || [];
    },
    onAddMenu() {
      this.$router.push({ path: '/menu/add' });
    },
    onAddSubMenu(node) {
      this.$router.push({ path: `/menu/add/${node.id}` });
    },
    onEditMenu(node) {
      this.$router.push({ path: `/menu/edit/${node.id}` });
    },
    async onDelMenu(node) {
      if (node.children && node.children.length > 0) {
        this.$message.error('当前节点存在叶子节点，请先删除子节点');
        return;
      }
      await axios.post(api.deleteMenuInfo, { id: node.id });
      this.$message.success('删除成功');

      // 修改菜单后 重新获取菜单及权限
      let result = await Permission.getPermission({
        silence: false, // 是否静默加载
        backself: false // 请求出错不用返回
      });
      await this.$store.dispatch('changeMenuTree', result.menuTree);
      await this.$store.dispatch('changePermission', result.permissionList);

      location.reload();
    },
    filterNode(value, data) {
      // return data.isForbidden === 0;
      return true;
    }
  }
};
</script>
