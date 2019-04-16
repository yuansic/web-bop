import axios from '@/utils/axios';
import api from '@/api/base.api';

// 路由钩子 判断页面访问权限
export const permissionHook = (router, store) => {
  router.beforeEach((to, from, next) => {
    const permission = store.state.permission || [];
    if (to.meta.permission && permission.indexOf(to.meta.permission) === -1) {
      next({ path: '/error/403' });
    } else {
      next();
    }
  });
};

// 路由钩子 设置侧栏选中菜单
export const sideActionHook = (router, store) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.active) {
      store.dispatch('changeSideAction', to.meta.active);
    }
    next();
  });
};

// 路由钩子 查询消息
export const queryNoticeHook = (router, store) => {
  router.beforeEach((to, from, next) => {
    if (store.state.permission.indexOf('notice:system:view') > -1) {
      // axios({
      //   method: 'POST',
      //   url: api.sysMsgList,
      //   data: { page: 1, limit: 5, all: 1 },
      //   silence: true
      // }).then(response => {
      //   if (response.data && response.data.list) {
      //     store.dispatch('setNoticeData', response.data.list);
      //   }
      // });
    }
    next();
  });
};
