import 'es6-promise/auto';
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import '@/utils/extend';

import '@/assets/css/common/element-theme.scss';
import Home from './Home';

import store from '@/store/index/index';
import routes from '@/router/index';
// import * as routerHook from '@/router/routerHook';

Vue.config.productionTip = false;
// 设置element尺寸
Vue.use(ElementUI, { size: 'small' });
// 加载vuex和router
Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({ routes: routes });

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
