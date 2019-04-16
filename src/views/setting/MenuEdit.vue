<template>
  <div class="menu-edit-page">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item to="/menu/mng">菜单管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加菜单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      ref="menuForm"
      :model="menuForm"
      label-width="120px"
      :rules="rules"
      class="menu-form-panel"
    >
      <el-form-item label="上级菜单" prop="parentName">
        <el-input
          v-model="menuForm.parentName"
          readonly
          placeholder="请选择"
          class="pointer-input"
          @focus="onShowMenuDialog"
        ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="menuForm.name" maxlength="20" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="href">
        <el-input v-model="menuForm.href" maxlength="50" placeholder="请输入菜单链接"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="menuForm.icon" maxlength="20" placeholder="请输入菜单图标"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="menuForm.sort" maxlength="20" placeholder="请输入排序数字"></el-input>
      </el-form-item>
      <el-form-item label="是否默认" prop="isDefault">
        <el-radio-group v-model="menuForm.isDefault">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示/隐藏" prop="isShow">
        <el-radio-group v-model="menuForm.isShow">
          <el-radio label="1">显示</el-radio>
          <el-radio label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限标识" prop="permission">
        <el-input
          v-model="menuForm.permission"
          maxlength="50"
          placeholder="请输入权限标识"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSaveMenu">保存</el-button>
        <router-link to="/menu/mng" class="ml-10">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <el-dialog title="选择菜单" :visible.sync="menuDialog.visible" width="600px">
      <el-input
        clearable
        placeholder="输入关键字进行筛选"
        v-model="menuDialog.filterText"
      ></el-input>
      <el-tree
        class="menu-dialog-tree"
        :data="menuDialog.treeData"
        :props="menuDialog.defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="handleFilterNode"
        highlight-current
        ref="menuTree"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSelectedMenu">确定</el-button>
        <el-button @click="menuDialog.visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api';
import Permission from '@/utils/permission';
export default {
  data() {
    return {
      menuForm: {
        id: '',
        parentId: '',
        parentName: '功能菜单',
        name: '',
        href: '',
        icon: '',
        sort: 0,
        isDefault: '0',
        isShow: '1',
        permission: ''
      },
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
      },
      menuDialog: {
        visible: false,
        filterText: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    };
  },
  watch: {
    'menuDialog.filterText': function(newValue, oldValue) {
      this.$refs.menuTree.filter(newValue);
    }
  },
  async created() {
    const routeName = this.$route.name;

    // 获取菜单树
    let tree = await axios.post(api.queryAllMenuListTree, {});
    this.menuDialog.treeData = tree.data || [];

    if (routeName === 'MenuEdit') {
      // 获取菜单详情
      let result = await axios.post(api.queryMenuDetailForId, { id: this.$route.params.menuid });
      this.menuForm = { ...result.data };
      this.menuForm.id = this.$route.params.menuid;
    }

    if (routeName === 'MenuSubAdd' || routeName === 'MenuEdit') {
      if (routeName === 'MenuSubAdd') this.menuForm.parentId = this.$route.params.parentId;

      // 获取parentId对应的parentName
      const parentName = this.getNodeName(tree.data, this.menuForm.parentId);
      if (parentName === '') {
        this.menuForm.parentId = '';
        this.menuForm.parentName = '功能菜单';
      } else {
        this.menuForm.parentName = parentName;
      }
    }
  },
  methods: {
    handleFilterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    onShowMenuDialog() {
      this.menuDialog.visible = true;
      // if (this.menuForm.parentId) this.$refs.menuTree.setCurrentKey(this.menuForm.parentId);
    },
    onSelectedMenu() {
      const node = this.$refs.menuTree.getCurrentNode();
      this.menuDialog.visible = false;
      this.menuDialog.filterText = '';
      this.menuForm.parentId = node.id;
      this.menuForm.parentName = node.name;
    },
    onSaveMenu() {
      this.$refs.menuForm.validate(async valid => {
        if (valid) {
          await axios.post(api.saveMenuInfo, { ...this.menuForm });
          this.$message.success('保存成功');
          // 修改菜单后 重新获取菜单及权限
          let result = await Permission.getPermission({
            silence: false, // 是否静默加载
            backself: false // 请求出错不用返回
          });
          await this.$store.dispatch('changeMenuTree', result.menuTree);
          await this.$store.dispatch('changePermission', result.permissionList);
          this.$router.push({ path: '/menu/mng' });
        }
      });
    },
    getNodeName(nodeArr, nodeId) {
      let parentName = '';
      function loopTree(arr) {
        if (parentName) return;
        arr.some(item => {
          if (item.id === nodeId) {
            parentName = item.name;
            return true;
          } else {
            item.children = item.children || [];
            if (item.children.length > 0) {
              loopTree(item.children);
            }
          }
        });
      }
      loopTree(nodeArr);
      return parentName;
    }
  }
};
</script>
<style></style>
