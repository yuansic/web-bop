<template>
  <div class="user-edit-page">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>机构用户</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user/list' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ state == 'add' ? '添加用户' : '修改用户信息' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      class="edit-form"
      ref="editForm"
      label-width="120px"
      :model="editForm"
      status-icon
      :disabled="isView"
      :rules="rules"
      :validate-on-rule-change="false"
    >
      <div class="item-header mb-20">基本信息</div>
      <el-form-item label="头像">
        <avatar-upload ref="avatar" :default-files="avatarImg"></avatar-upload>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model.trim="editForm.name"
          placeholder="请输入姓名"
          autocomplete="off"
          style="width:350px"
          :maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="loginName" class="account-item">
        <el-input
          v-model.trim="editForm.loginName"
          :maxlength="20"
          placeholder="请输入账号"
          :disabled="state == 'edit'"
          autocomplete="off"
          style="width:350px"
        ></el-input>
        <div class="account-tips font-gray" v-if="state === 'add'">
          <i class="el-icon-info font-orange mr-10"></i>
          注意：只能输入ldap帐号
        </div>
      </el-form-item>
      <el-form-item label="是否允许登录" prop="loginFlag" class="roles-item">
        <el-radio-group v-model="editForm.loginFlag">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="数据权限" prop="dataAuth" class="roles">
        <el-radio-group v-model="editForm.dataAuth" class="datapre-redio-group">
          <el-radio :label="1">
            所有数据
            <span class="font-gray">
              <i class="el-icon-info font-orange ml-20 mr-10" style="cursor:text"></i>可查看所有数据
            </span>
          </el-radio>
          <el-radio :label="0"
            >个人数据
            <span class="font-gray">
              <i class="el-icon-info font-orange ml-20 mr-10" style="cursor:text"></i>
              只可查看自己操作的数据
            </span>
          </el-radio>
        </el-radio-group>
      </el-form-item> -->

      <div class="item-header mb-20">分配角色</div>
      <div v-if="roleArr.length != 0">
        <el-form-item label="请选择" prop="roleId" class="roles">
          <el-checkbox-group v-model="editForm.roleId" style="width:500px">
            <el-checkbox
              v-for="(item, index) in roleArr"
              :key="index"
              :label="item.id"
              name="type"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label=" " v-if="!isView">
          <el-button type="primary" @click="onSubmitForm">保存</el-button>
          <el-button @click="onCancelBack">返回</el-button>
        </el-form-item>
      </div>
      <div v-else style="margin-left:60px;">
        <span> 未查询到角色配置，请先添加角色后再添加用户。</span>
        <br />
        <el-button v-if="!isView" type="primary" class="mt-10" @click="gotoRolelist"
          >去添加</el-button
        >
      </div>
    </el-form>
    <div v-if="isView" style="margin-left:120px;">
      <el-button type="primary" @click="onCancelBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api.js';
import Permission from '@/utils/permission';

import ImgUpload from '@/components/ImgUpload';
import AvatarUpload from '@/components/AvatarUpload';

export default {
  components: {
    ImgUpload,
    AvatarUpload
  },
  data() {
    return {
      isView: false,
      avatarImg: '',
      editForm: {
        name: '',
        loginName: '',
        photo: '',
        id: '',
        loginFlag: '1',
        // dataAuth: '',
        roleId: []
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        loginName: [{ required: true, message: '账号不能为空' }],
        // dataAuth: [{ required: true, message: '请选择数据权限', trigger: 'change' }],
        roleId: [
          { type: 'array', required: true, message: '请至少分配一个角色', trigger: 'change' }
        ]
      },
      state: 'add',
      roleArr: [],
      imgUrl: '',
      imgVisible: false
    };
  },
  async created() {
    let role = await axios.post(api.queryAllList, {});
    this.roleArr = role.data;
    if (this.$route.name === 'UserEdit' || this.$route.name === 'UserView') {
      this.state = 'edit';
      this.editForm.id = this.$route.params.id;

      let userDetail = await axios.get(api.getSysUserById, {
        params: { id: this.$route.params.id }
      });
      userDetail = userDetail.data;
      this.editForm = userDetail;
      this.avatarImg = userDetail.photo;
    }
    if (this.$route.name === 'UserView') this.isView = true;
  },
  methods: {
    onSubmitForm() {
      const avatar = this.$refs.avatar.getUploadFiles();
      if (!avatar) {
        this.$message.error('请上传用户头像');
        return;
      }
      this.editForm.photo = avatar;
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          if (this.state === 'add') {
            await axios.post(api.saveSysUser, this.editForm);
            this.$message.success('添加成功');
            this.$router.push({ path: '/user/list' });
          } else {
            await axios.post(api.updateSysUserById, this.editForm);
            this.$message.success('修改成功');
            // 修改菜单后 重新获取菜单及权限
            let result = await Permission.getPermission({
              silence: false, // 是否静默加载
              backself: false // 请求出错不用返回
            });
            await this.$store.dispatch('changeMenuTree', result.menuTree);
            await this.$store.dispatch('changePermission', result.permissionList);
            this.$router.push({ path: '/user/list' });
          }
        }
      });
    },
    onCancelBack() {
      this.$router.push({ path: '/user/list' });
    },
    gotoRolelist() {
      this.$router.push({ path: '/role/list' });
    }
  }
};
</script>
