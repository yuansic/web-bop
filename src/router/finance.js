import publicRouter from './publicRouter';
import store from '@/store/finance/index';

// 资金变动查询
const CapitalDetailList = () => import('@/views/finance/CapitalDetailList');
// 订单列表
const CapitalOrderList = () => import('@/views/finance/CapitalOrderList');
// 交易流水
const CapitaltranFlowList = () => import('@/views/finance/CapitaltranFlowList');

var router = [
  {
    path: '/capital/detail/list',
    name: 'CapitalDetailList',
    component: CapitalDetailList,
    meta: {
      active: '/capital/detail/list',
      permission: 'finance:capital:detail:view'
    }
  },
  {
    path: '/capital/order/list',
    name: 'CapitalOrderList',
    component: CapitalOrderList,
    meta: {
      active: '/capital/order/list',
      permission: 'finance:capital:order:view'
    }
  },
  {
    path: '/capital/tranflow/list',
    name: 'CapitaltranFlowList',
    component: CapitaltranFlowList,
    meta: {
      active: '/capital/tranflow/list',
      permission: 'finance:capital:tranflow:view'
    }
  },
  ...publicRouter.getRouter(store)
];
export default router;
