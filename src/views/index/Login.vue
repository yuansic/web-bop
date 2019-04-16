<template>
  <div class="login-page">
    <div class="content-flex">
      <div class="login-header">
        <img class="login-logo" src="../../assets/img/logo.png" />
        <div class="header-title">煤链社运营管理系统</div>
      </div>
      <div class="login-panel">
        <el-alert class="account-tip" type="success" :closable="false">
          <span slot="title"><i class="el-icon-info"></i>请使用ldap账户登录</span>
        </el-alert>
        <el-form :model="loginForm" :rules="rules" size="medium" ref="loginForm" class="login-form">
          <el-form-item label="" prop="loginName">
            <el-input
              type="text"
              v-model="loginForm.loginName"
              autocomplete="off"
              placeholder="请输入用户名"
              :maxlength="20"
            >
              <i slot="prefix" class="iconfont icon-username input-prefix"></i>
            </el-input>
          </el-form-item>
          <!-- 模拟密码框 -->
          <el-form-item label="" prop="ldapPassword">
            <div class="mock-pwd-panel">
              <div class="mock-pwd-content">
                <template v-if="pwdLength > 0">
                  <span class="mock-dot" v-for="(el, index) in pwdLength" :key="index"></span>
                  <span v-show="showMockMouse" class="mock-mouse"></span>
                </template>
                <template v-else>
                  <span v-show="showMockMouse" class="mock-mouse mock-mouse-position"></span>
                  <span class="mock-placeholder" :class="{ 'ie-placeholder': isIE }"
                    >请输入密码</span
                  >
                </template>
              </div>
              <el-input
                ref="pwdInput"
                id="pwdInput"
                v-model="loginForm.ldapPassword"
                class="pwd-input"
                type="text"
                autocomplete="off"
                :maxlength="20"
                placeholder="请输入密码"
                @focus="onMockFocusBlur(true)"
                @blur="onMockFocusBlur(false)"
                @keyup.left.native="onMockKeyup"
                @keyup.right.native="onMockKeyup"
                @keyup.enter.native="submitForm"
              >
                <i slot="prefix" class="iconfont icon-mima input-prefix"></i>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item class="login-button-item">
            <el-button type="primary" @click="submitForm">登 录</el-button>
          </el-form-item>
        </el-form>
        <div class="forget-link">
          <a href="https://ldap.sijibao.com/" target="__blank">忘记密码</a>
        </div>
      </div>

      <div class="login-footer">
        <a class="login-link" href="https://www.sijibao.com" target="__blank">关于司机宝</a>
        <a class="login-link" href="http://mls.sijibao.com" target="__blank">煤链社商城</a>
        <a class="login-link" href="https://www.sijibao.com" target="__blank">admin登录</a>
      </div>
    </div>
    <div class="footer-flex">©2018 武汉物易云通网络科技有限公司 版权所有</div>
  </div>
</template>

<script>
import JSEncrypt from '@/utils/JSEncrypt';
import utils from '@/utils/utils';
import axios from '@/utils/axios';
import api from '@/api/index.api';

export default {
  data() {
    return {
      showMockMouse: false,
      isIE: false,
      pwdInputType: 'text',
      loginForm: {
        loginName: '',
        ldapPassword: ''
      },
      rules: {
        loginName: [{ required: true, message: '请输入ldap用户名', trigger: 'blur' }],
        ldapPassword: [{ required: true, message: '请输入ldap用户密码', trigger: 'blur' }]
      }
    };
  },
  computed: {
    pwdLength() {
      return this.loginForm.ldapPassword.length;
    }
  },
  created() {
    // zhu.qiao
    // var encrypted = JSEncrypt.encrypt('Sjb@2019');
    // console.log(encrypted);
    this.isIE = IEtag !== -1 && IEtag !== 'edge' ? true : false;
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 登录
          let result = await axios.post(api.login, {
            loginIp: '10.10.10.10',
            loginname: this.loginForm.loginName,
            ldapPassword: JSEncrypt.encrypt(this.loginForm.ldapPassword) // 密码rsa加密
          });
          // 获取用户信息
          let userData = await axios({
            method: 'GET',
            url: api.getSysUser,
            headers: {
              Authorization: result.data.token
            }
          });
          // 存储登录凭证
          localStorage.setItem('Authorization', result.data.token);
          // 存储用户信息
          localStorage.setItem('userData', JSON.stringify(userData.data));
          // 查询字典数据 并存储
          await utils.getSysdict('', true);

          // 跳回来源页面
          const target = utils.getQuery('target');
          const path = utils.getQuery('path');
          if (target) {
            window.location.href = './' + target + (path ? '#/' + path : '');
          } else {
            window.location.href = 'mycenter.html'; // 未标记来源 则跳转至欢迎页
          }
        }
      });
    },
    // 模拟聚焦
    onMockFocusBlur(type) {
      this.showMockMouse = type;
    },
    onMockKeyup(e) {
      // 当输入左右箭头键时  强行将光标设到最后
      // 否则还要将模拟框的光标移动到对应位置  做起来复杂 尝试过实现 功能没问题 但光标反应慢半拍 字符间距不好控制
      // 这里还有个问题  使用鼠标点击选取光标位置 或者选中文本进行删除 模拟框没有同步
      const elInput = document.getElementById('pwdInput');
      elInput.focus();
      if (!this.isIE) {
        // 非IE浏览器
        elInput.selectionStart = this.pwdLength;
        elInput.selectionEnd = this.pwdLength;
      } else {
        // IE
        var range = document.selection.createRange();
        range.move('character', this.pwdLength);
        range.select();
      }
    }
  }
};
</script>

<style lang="postcss">
</style>
