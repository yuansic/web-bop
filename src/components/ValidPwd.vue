<template>
  <div>
    <el-dialog
      :visible.sync="pwdDialog.isShow"
      :before-close="pwdBeforeClose"
      custom-class="pay-custom-dialog"
      title="验证支付密码"
    >
      <el-form :model="checkForm" :rules="rules" ref="checkForm" size="medium" class="mt-10">
        <!-- 模拟密码框 -->
        <el-form-item label="" prop="password">
          <div class="mock-pwd-panel">
            <div class="mock-pwd-content">
              <template v-if="checkForm.password.length > 0">
                <span
                  class="mock-dot"
                  v-for="(el, index) in checkForm.password.length"
                  :key="index"
                ></span>
                <span v-show="mockMouseShow" class="mock-mouse"></span>
              </template>
              <template v-else>
                <span v-show="mockMouseShow" class="mock-mouse mock-mouse-position"></span>
                <span class="mock-placeholder" :class="{ 'ie-placeholder': isIE }"
                  >请输入支付密码</span
                >
              </template>
            </div>
            <el-input
              ref="pwdInput"
              id="pwdInput"
              v-model="checkForm.password"
              class="pwd-input"
              type="text"
              autocomplete="off"
              :maxlength="20"
              placeholder="请输入支付密码"
              @focus="onMockFocusBlur(true)"
              @blur="onMockFocusBlur(false)"
              @keyup.left.native="onMockKeyup('pwdInput')"
              @keyup.right.native="onMockKeyup('pwdInput')"
            >
              <i slot="prefix" class="iconfont icon-mima input-prefix"></i>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item v-if="checkYzm" label="" prop="yzmCode">
          <div>
            验证码将发送至:<span class="font-default">{{ phoneNumber }}</span>
          </div>
          <el-input
            placeholder="请输入验证码"
            type="text"
            autocomplete="off"
            :maxlength="6"
            v-model="checkForm.yzmCode"
          >
            <i slot="prefix" class="iconfont icon-yzm input-prefix" style="line-height:36px;"></i>
            <el-button
              slot="append"
              @click="getYzmCode('checkForm')"
              class="getcode"
              :disabled="countdown.issend"
              >获取验证码</el-button
            >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-c">
        <el-button @click="pwdBeforeClose">取消</el-button>
        <el-button type="primary" :loading="islonding" @click="pwdConfirmSubmit">
          <span v-show="!islonding">确定</span>
          <span v-show="islonding">执行中...</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import valid from '@/utils/valid';
import axios from '@/utils/axios';
import api from '@/api/base.api';
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    islonding: {
      type: Boolean,
      default: false
    },
    checkYzm: {
      type: Boolean,
      default: false
    },
    phoneNumber: {
      type: String,
      default: ''
    }
  },
  data: function() {
    var valiPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!valid.checkPaypwd(value)) {
        callback(new Error('密码应为6位数字'));
      } else {
        callback();
      }
    };

    var valiyzm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if (!valid.checkYzm(value)) {
        callback(new Error('验证码必须为6位数字'));
      } else {
        callback();
      }
    };
    return {
      pwdDialog: {
        isShow: false,
        loadingText: '执行中'
      },
      checkForm: {
        password: '',
        yzmCode: ''
      },
      rules: {
        password: [{ validator: valiPwd, trigger: 'blur' }],
        yzmCode: [{ validator: valiyzm, trigger: 'blur' }]
      },
      countdown: {
        first: false,
        issend: false,
        second: 60
      },
      isIE: false,
      mockMouseShow: false
    };
  },
  watch: {
    visible(newValue, oldValue) {
      if (newValue) {
        this.pwdShow();
      } else {
        this.pwdClose();
      }
    }
  },
  created() {
    this.isIE = IEtag !== -1 && IEtag !== 'edge' ? true : false;
  },
  methods: {
    pwdShow() {
      this.checkForm.password = '';
      this.checkForm.yzmCode = '';
      this.pwdDialog.isShow = true;
    },
    pwdClose() {
      this.pwdDialog.isShow = false;
      this.$emit('update:visible', false);
    },
    pwdBeforeClose() {
      if (this.islonding) {
        this.$message.error('操作进行中，此时不可取消，请等待执行结果');
      } else {
        this.pwdClose();
      }
    },
    pwdConfirmSubmit() {
      this.$refs.checkForm.validate(valid => {
        if (valid) {
          let backData = {
            password: this.checkForm.password
          };
          if (this.checkYzm) {
            backData.yzmCode = this.checkForm.yzmCode;
          }
          this.$emit('submit', backData);
        }
      });
    },
    // 获得验证码
    async getYzmCode(form) {
      if (this.countdown.issend) return;
      // 发送验证码
      let rtn = await axios.post(api.send, {
        phoneNumber: '',
        type: 'MESSAGE_PAY_CODE'
      });
      // 发送成功返回token
      // this.authorization = rtn.data;
      // 开启倒计时
      this.onStartTimer();
    },
    // 开启计时器
    onStartTimer: function() {
      this.countdown.issend = true;
      if (this.countdown.second == 0) {
        this.countdown.issend = false;
        this.countdown.second = 60;
      } else {
        this.countdown.second--;
        this.yzmTimer = setTimeout(() => {
          this.onStartTimer();
        }, 1000);
      }
    },
    // 清除计时器
    onClearTimer() {
      clearTimeout(this.yzmTimer);
      this.countdown.issend = false;
      this.countdown.second = 60;
    },
    // 模拟聚焦
    onMockFocusBlur(type) {
      this.mockMouseShow = type;
    },
    onMockKeyup(id) {
      // 当输入左右箭头键时  强行将光标设到最后
      // 否则还要将模拟框的光标移动到对应位置  做起来复杂 尝试过实现 功能没问题 但光标反应慢半拍 字符间距不好控制
      // 这里还有个问题  使用鼠标点击选取光标位置 或者选中文本进行删除 模拟框没有同步
      const elInput = document.getElementById(id);
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
