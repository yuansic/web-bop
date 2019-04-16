<template>
  <div class="layout">
    <template v-if="!isLoading">
      <div class="header-wrap">
        <header-nav :nav-active="navActive"></header-nav>
      </div>
      <div class="layout-content" :style="styleObject">
        <el-container>
          <el-aside
            :class="{
              menuWidthLarge: g_config.fullScreen && !g_config.isCollapse,
              menuWidthSmall: !g_config.fullScreen && !g_config.isCollapse,
              menuWidthMini: g_config.isCollapse
            }"
          >
            <side-menu :nav-active="navActive"></side-menu>
          </el-aside>
          <el-main>
            <div class="layout-content-main">
              <router-view></router-view>
            </div>
          </el-main>
        </el-container>
      </div>
      <div class="layout-footer">&copy; 2018 煤链社 版权所有</div>
    </template>
    <template v-else>
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import utils from '@/utils/utils';
import HeaderNav from '@/components/HeaderNav';
import SideMenu from '@/components/SideMenu';
import Permission from '@/utils/permission';
import Router from '@/router/mall';

export default {
  data: function() {
    return {
      navActive: 'mall',
      isLoading: true
    };
  },
  components: {
    HeaderNav,
    SideMenu
  },
  created: async function() {
    window.addEventListener('resize', this.handleResize);
    // 获取到用户权限
    let result = await Permission.getPermission();
    this.isLoading = false;
    if (result.error) return;

    // 将菜单tree存入store 当权限变更 请刷新页面
    await this.$store.dispatch('changeMenuTree', result.menuTree);
    // 将权限存入store 当权限变更 请刷新页面
    await this.$store.dispatch('changePermission', result.permissionList);

    // 加载路由地址
    this.$router.addRoutes(Router);
  },
  computed: {
    styleObject() {
      return this.g_config.fullScreen
        ? 'width: auto;min-width: 100%;max-width: 100%;'
        : 'width:1300px';
    },
    ...mapState({
      g_config: state => state.g_config
    })
  },
  methods: {
    handleResize() {
      var _w = document.documentElement.clientWidth;
      var g_config = { ...this.$store.state.g_config };
      if (_w >= 1300) {
        g_config.isCollapse = false;
        this.$store.dispatch('changeGlobal', g_config);
        localStorage.setItem('g_config', JSON.stringify(g_config));
      } else {
        g_config.isCollapse = true;
        this.$store.dispatch('changeGlobal', g_config);
        localStorage.setItem('g_config', JSON.stringify(g_config));
      }
    }
  }
};
</script>
<style>
@import '../../assets/css/common/reset.css';
@import '../../assets/css/common/layout.css';
@import '../../assets/css/common/common.css';
@import '../../assets/css/mall.css';
</style>
