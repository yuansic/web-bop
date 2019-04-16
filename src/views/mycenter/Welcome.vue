<template>
  <div class="welcome-page">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>工作台</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="segment welcome-segment">
      <div class="segment-area">
        <el-row>
          <el-col :span="24">
            <div class="segment-content">
              欢迎您，<span class="font-default">{{ userData.name }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="user-avatar">
              <img :src="userData.photo" alt="" />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="segment-label">登录帐号</div>
            <div class="segment-content">{{ userData.loginName }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="segment-label">用户角色</div>
            <div class="segment-content">不知道什么角色</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="segment-label">本次登录</div>
            <div class="segment-content">
              IP: 192.168.12.133 时间：2019年3月4日 星期一 18:29:37
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="segment-label">上次登录</div>
            <div class="segment-content">
              IP: 192.168.12.133 时间：2019年3月4日 星期一 18:29:37
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/notice.api';
import utils from '@/utils/utils';
import defaultAvatar from '@/assets/img/default.png';

export default {
  data() {
    return {
      userData: {}
    };
  },
  created() {
    const userData = utils.getLocalItem('userData');
    userData.photo = userData.photo || defaultAvatar;
    if (userData) this.userData = userData;
  },
  methods: {}
};
</script>
