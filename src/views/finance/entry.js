import 'es6-promise/auto';
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import '@/utils/extend';

import '@/assets/css/common/element-theme.scss';
import Home from './Home';

import store from '@/store/finance/index';
import * as routerHook from '@/router/routerHook';

Vue.config.productionTip = false;
// 设置element尺寸
Vue.use(ElementUI, { size: 'small' });
// 加载vuex和router
Vue.use(Vuex);
Vue.use(VueRouter);

// 初始化一个空路由对象 当权限获取完成后 动态添加路由地址
const router = new VueRouter({ routes: [] });

// 路由钩子 判断页面访问权限
routerHook.permissionHook(router, store);
// 路由钩子 设置侧栏选中
routerHook.sideActionHook(router, store);
// 路由钩子 查询消息
routerHook.queryNoticeHook(router, store);

// 注册自定义指令 判断权限
Vue.directive('has', {
  bind(el, binding, vnode) {
    // 获取按钮权限
    const allPer = store.state.permission || [];
    if (binding.value) {
      if (allPer.indexOf(binding.value) === -1) {
        Vue.nextTick(() => vnode.elm.parentNode.removeChild(el));
      }
    } else {
      Vue.nextTick(() => vnode.elm.parentNode.removeChild(el));
    }
  }
});

new Vue({
  router,
  store,
  mounted() {
    // 同页面hash变化 使用window.location.href在ie下会出现  页面地址变了  router并没有触发
    // https://github.com/vuejs/vue-router/issues/1849
    const app = this;
    if (
      '-ms-scroll-limit' in document.documentElement.style &&
      '-ms-ime-align' in document.documentElement.style
    ) {
      window.addEventListener(
        'hashchange',
        function() {
          const currentPath = window.location.hash.slice(1);
          // 若页面地址跟当前router不匹配 则手动push
          if (app.$route.path !== currentPath) {
            app.$router.replace(currentPath);
          }
        },
        false
      );
    }
  },
  render: h => h(Home)
}).$mount('#app-box');
