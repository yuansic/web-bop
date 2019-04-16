// 所有模块公用路由
const HttpError = function(resolve) {
  require(['@/components/HttpError'], resolve);
};
let publicRouter = {};

publicRouter.getRouter = store => {
  let publicRouter = [
    { path: '/error/:code', component: HttpError },
    { path: '*', redirect: '/error/404' }
  ];
  // 匹配path: '/'时的跳转地址
  // 若不传store 页面路由需自行定义path: '/'时的跳转地址
  if (store) {
    publicRouter.push({
      path: '/',
      redirect: to => {
        // 默认跳转到侧栏菜单第一个 找不到则404
        const menuTree = store.state.menuTree || [];
        if (menuTree.length === 0) return '/error/404';

        const sideData = menuTree.filter(el => el.href === store.state.selfPage);
        let redirectPath = '';

        // 循环匹配 找到第一个以"/"开头的path
        function loopTree(sideArray) {
          if (redirectPath) return;
          sideArray.some(item => {
            if (item.href.indexOf('/') === 0) {
              redirectPath = item.href;
              return true;
            } else {
              item.children = item.children || [];
              if (item.children.length > 0) loopTree(item.children);
            }
          });
        }
        loopTree(sideData);
        redirectPath = redirectPath || '/error/404';
        return redirectPath;
      }
    });
  }
  return publicRouter;
};
export default publicRouter;
