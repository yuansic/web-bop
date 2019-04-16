<template>
  <div class="header-content">
    <el-row>
      <el-col :span="4">
        <div class="logo">
          <!-- <img @click="onJumpIndex" src="../assets/img/logo.png" /> -->
          <span class="logo-title">煤链社运营管理系统</span>
        </div>
      </el-col>
      <el-col :span="12">
        <el-menu :default-active="navActive" mode="horizontal" class="header-nav-menu">
          <template v-for="(el, index) in navData">
            <el-menu-item v-if="el.href !== 'notice'" :index="el.href" :key="index">
              <a :href="el.href + '.html'" target="_self">{{ el.name }}</a>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
      <el-col :span="8">
        <ul class="header-shortcut-panel">
          <li>
            <div class="header-setting" @click="layoutVisible = true">
              <i class="iconfont icon-shezhi"></i>
              <span slot="title">布局设置</span>
            </div>
          </li>
          <li>
            <div class="menu-link" style="display:none">
              <a href="https:www.baidu.com" target="_blank">百度</a>
            </div>
          </li>
          <li v-if="isShowNotice">
            <el-dropdown class="heander-notice">
              <el-badge :is-dot="noticeData.length > 0" class="notice-dot"
                ><i class="iconfont icon-news" @click="onJumpNoticeList"></i
              ></el-badge>
              <el-dropdown-menu slot="dropdown" class="heander-notice-warp">
                <template v-if="noticeData.length > 0">
                  <el-dropdown-item
                    v-for="(item, index) in noticeData.filter((el, idx) => idx < 5)"
                    :key="index"
                    :divided="index != 0"
                    @click.native="onJumpNoticeDetail(item)"
                  >
                    <div class="notice-item">
                      <div class="notice-title">您有新消息</div>
                      <div class="notice-desc">{{ item.content }}</div>
                    </div>
                  </el-dropdown-item>
                  <div v-if="noticeData.length > 5" class="notice-more" @click="onJumpNoticeList">
                    查看更多
                  </div>
                </template>
                <template v-else>
                  <el-dropdown-item>
                    <div class="notice-item no-notice">
                      暂无消息
                    </div>
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li>
            <el-menu class="avatar" mode="horizontal">
              <el-submenu index="company" popper-class="company-down-menu">
                <template slot="title">
                  <div class="company-name-menu text-ellipsis" :title="fullName">
                    <span :style="backgroundSpan" class="company-logo"></span>
                    <span>{{ fullName }}</span>
                  </div>
                </template>
                <div class="header-menu-item">
                  <div class="text-ellipsis" :title="loginName">
                    <i class="iconfont icon-qiye"></i>
                    {{ loginName }}
                  </div>
                </div>
                <div class="header-menu-item" @click="jumpPage(1)">
                  <i class="iconfont icon-me"></i>个人中心
                </div>
                <div class="header-menu-item" @click="jumpPage(2)">
                  <i class="iconfont icon-setting"></i>系统设置
                </div>
                <div class="header-menu-item" @click="jumpPage(3)">
                  <i class="iconfont icon-tuichu"></i>退出
                </div>
              </el-submenu>
            </el-menu>
          </li>
        </ul>
      </el-col>
    </el-row>

    <el-dialog
      title="布局设置"
      :visible.sync="layoutVisible"
      width="500px"
      center
      :modal="false"
      @close="closeSetDialog"
    >
      <div class="text-c">
        <p class="font-orange mb-30">这些设置将应用到所有页面</p>
        <div>
          <span>宽度设置：</span>
          <el-radio-group v-model="g_config.fullScreen">
            <el-radio :label="true">全屏</el-radio>
            <el-radio :label="false">居中</el-radio>
          </el-radio-group>
        </div>
        <div class="mt-10">
          <span>左侧菜单：</span>
          <el-radio-group v-model="g_config.isCollapse">
            <el-radio :label="false">展开</el-radio>
            <el-radio :label="true">收起</el-radio>
          </el-radio-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="layoutVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import defaultAvatar from '@/assets/img/default.png';
import utils from '@/utils/utils';

export default {
  props: {
    navActive: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fullName: '',
      loginName: '',
      backgroundSpan: {},
      layoutVisible: false
    };
  },
  created() {
    if (this.isLogin) {
      const userData = utils.getLocalItem('userData');
      this.fullName = userData.name || '';
      this.loginName = userData.loginName || '';

      const backgroundUrl = userData.photo || defaultAvatar;
      this.backgroundSpan = { backgroundImage: 'url(' + backgroundUrl + ')' };
    }
  },
  methods: {
    closeSetDialog() {
      const g_config = this.$store.state.g_config;
      localStorage.setItem('g_config', JSON.stringify(g_config));
    },
    jumpPage(type) {
      if (type == 1) {
        window.location.href = './mycenter.html#/welcome';
      } else if (type == 2) {
        window.location.href = './setting.html#/layoutset';
      } else {
        // 清除登录信息
        window.localStorage.removeItem('Authorization');
        window.localStorage.removeItem('userData');
        window.location.href = './index.html';
      }
    },
    onJumpNoticeDetail(row) {
      // window.location.href = './notice.html#/noticedetail/' + row.messageId;
      window.location.href = './notice.html';
    },
    onJumpNoticeList() {
      window.location.href = './notice.html';
    },
    onJumpIndex() {
      window.location.href = './index.html';
    }
  },
  computed: {
    ...mapState({
      isShowNotice: state => state.permission.indexOf('notice:system:view') > -1,
      navData: state => state.menuTree,
      g_config: state => state.g_config,
      isLogin: state => state.isLogin,
      noticeData: state => state.noticeData
    })
  }
};
</script>
<style></style>
