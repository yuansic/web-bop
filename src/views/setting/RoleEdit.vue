<template>
  <div class="role-edit-page">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/role/list' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ state == 'add' ? '添加角色' : '修改角色' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      ref="roleForm"
      :model="roleForm"
      label-width="80px"
      :rules="rules"
      class="role-form-panel"
    >
      <div class="item-header mb-20">基本信息</div>
      <div class="ml-20">
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="roleForm.name"
            autocomplete="off"
            placeholder="请输入角色名称"
            :disabled="state === 'view'"
            :maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="name">
          <el-input
            v-model="roleForm.enname"
            autocomplete="off"
            placeholder="请输入英文名称"
            :disabled="state === 'view'"
            :maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否可用" prop="useable">
          <el-radio-group v-model="roleForm.useable" :disabled="state === 'view'">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据范围" prop="dataScope">
          <el-select v-model="roleForm.dataScope" placeholder="请选择" :disabled="state === 'view'">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="item-header mt-20">权限设置</div>
      <div class="role-tree">
        <el-tree
          :data="treeNode"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          ref="tree"
          highlight-current
          :filter-node-method="handleFilterNode"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div class="ml-15">
        <el-button v-if="state != 'view'" type="primary" size="small" @click="onSubmitForm"
          >保存</el-button
        >
        <el-button size="small" @click="onCancelBack">返回</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api.js';
import Permission from '@/utils/permission';

export default {
  data() {
    return {
      dataScopeOptions: [{ value: '0', label: '个人数据' }, { value: '1', label: '所有数据' }],
      roleForm: {
        menuIdList: [],
        name: '',
        enname: '',
        id: '',
        useable: '1',
        dataScope: '1'
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        enname: [{ required: true, message: '请输入英文名称', trigger: 'blur' }]
      },
      state: 'add',
      treeNode: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultKeys: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      // 获取菜单树
      let treeData = await axios.post(api.queryAllMenuListTree, {});
      treeData = treeData.data || [];

      // 设置树节点的disabled 并获取defaultKeys
      this.initTreeNode(treeData, this.$route.name === 'RoleView');
      this.treeNode = treeData;

      if (this.$route.name === 'RoleAdd') {
        this.state = 'add';
        this.$refs.tree.setCheckedKeys([...this.defaultKeys]);
      } else if (this.$route.name === 'RoleView') {
        this.state = 'view';
        this.roleForm.id = this.$route.params.id;
        this.onGetRoleTree();
      } else {
        this.state = 'edit';
        this.roleForm.id = this.$route.params.id;
        this.onGetRoleTree();
      }
      // this.$nextTick(() => {
      //   // 过滤掉默认权限  不要显示
      //   this.$refs.tree.filter();
      // });
    },
    // 初始化树结构 flag是否只能查看
    initTreeNode(tree, flag) {
      tree.forEach(item => {
        item.disabled = flag ? true : item.isDefault === '1';
        // 获取最后一级且默认选中的id
        if (item.menuLevel === 4 && item.isDefault === '1') {
          this.defaultKeys.push(item.id);
        }
        item.children = item.children || [];
        if (item.children.length > 0) {
          this.initTreeNode(item.children, flag);
        }
      });
    },
    // 过滤隐藏的菜单
    handleFilterNode(value, data) {
      return data.isShow === '0';
    },
    // 获取当前角色权限 并设置选中
    async onGetRoleTree() {
      let roleSelectedMenu = await axios.post(api.querySysRoleDetailInfo, { id: this.roleForm.id });

      roleSelectedMenu = roleSelectedMenu.data || {};
      roleSelectedMenu.menuList = roleSelectedMenu.menuList || [];
      this.roleForm = {
        name: roleSelectedMenu.name,
        enname: roleSelectedMenu.enname,
        id: roleSelectedMenu.id,
        useable: roleSelectedMenu.useable,
        dataScope: roleSelectedMenu.dataScope
      };
      let roleSelectedKeys = [];
      roleSelectedMenu.menuList.forEach(item => {
        // 规定第4级为权限操作
        item.menuLevel === 4 && roleSelectedKeys.push(item.id);
      });
      // 设置选中
      this.$refs.tree.setCheckedKeys([...roleSelectedKeys, ...this.defaultKeys]);
    },
    onCancelBack() {
      this.$router.push({ path: '/role/list' });
    },
    onSubmitForm() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          const treeRefs = this.$refs.tree;
          if (treeRefs.getCheckedKeys().length == 0) {
            this.$message.error('请至少勾选一条权限');
            return;
          }
          // 选中的所有节点  和半选节点
          this.roleForm.menuIdList = [
            ...treeRefs.getCheckedKeys(),
            ...treeRefs.getHalfCheckedKeys()
          ];
          let response = await axios.post(api.saveSysRoleInfo, this.roleForm);
          this.$message.success('保存成功');
          // 修改权限后 重新获取权限
          let result = await Permission.getPermission({
            silence: false, // 是否静默加载
            backself: false // 请求出错不用返回
          });
          await this.$store.dispatch('changeMenuTree', result.menuTree);
          await this.$store.dispatch('changePermission', result.permissionList);
          this.$router.push({ path: '/role/list' });
        }
      });
    }
  }
};
</script>
