import publicRouter from './publicRouter';
import store from '@/store/notice/index';

// 消息列表
const NoticeList = () => import('@/views/notice/NoticeList');
// 消息详情
const NoticeDetail = () => import('@/views/notice/NoticeDetail');

var router = [
  {
    path: '/notice/list',
    name: 'NoticeList',
    component: NoticeList,
    meta: {
      active: '/notice/list',
      permission: 'notice:system:view'
    }
  },
  {
    path: '/notice/detail/:messageId',
    name: 'NoticeDetail',
    component: NoticeDetail,
    meta: {
      active: '/notice/list',
      permission: 'notice:system:view'
    }
  },
  ...publicRouter.getRouter(store)
];
export default router;
