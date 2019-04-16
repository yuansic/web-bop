import publicRouter from './publicRouter';
import store from '@/store/mall/index';

// 待确认订单列表
const OrderPendingList = () => import('@/views/mall/OrderPendingList');
// 待确认订单详情
const OrderPendingDetail = () => import('@/views/mall/OrderPendingDetail');
// 煤矿列表
const CoalMineList = () => import('@/views/mall/CoalMineList');
// 煤矿详情
const CoalMineDetail = () => import('@/views/mall/CoalMineDetail');
// 煤矿对公账户添加/编辑
const CoalMineForm = () => import('@/views/mall/CoalMineForm');

// 商户列表
const MerchantList = () => import('@/views/mall/MerchantList');
// 商户详情
const MerchantDetail = () => import('@/views/mall/MerchantDetail');
// 平台公司列表
const PlatformList = () => import('@/views/mall/PlatformList');
// 平台公司详情
const PlatformDetail = () => import('@/views/mall/PlatformDetail');
// 商品列表
const GoodsList = () => import('@/views/mall/GoodsList');
// 商品详情
const GoodsDetail = () => import('@/views/mall/GoodsDetail');
// 待审核商品列表
const GoodsCheckList = () => import('@/views/mall/GoodsCheckList');
// 待审核商品详情
const GoodsCheckDetail = () => import('@/views/mall/GoodsCheckDetail');
// 商品矿发煤价列表
const GoodsMinePrice = () => import('@/views/mall/GoodsMinePrice');

var router = [
  {
    path: '/order/pending/list',
    name: 'OrderPendingList',
    component: OrderPendingList,
    meta: {
      active: '/order/pending/list',
      permission: 'mall:order:pending:view'
    }
  },
  {
    path: '/order/pending/detail/:id',
    name: 'OrderPendingDetail',
    component: OrderPendingDetail,
    meta: {
      active: '/order/pending/list',
      permission: 'mall:order:pending:view'
    }
  },
  {
    path: '/coalmine/list',
    name: 'CoalMineList',
    component: CoalMineList,
    meta: {
      active: '/coalmine/list',
      permission: 'mall:coalmine:list:view'
    }
  },
  {
    path: '/coalmine/detail/:coalMineId',
    name: 'CoalMineDetail',
    component: CoalMineDetail,
    meta: {
      active: '/coalmine/list',
      permission: 'mall:coalmine:list:view'
    }
  },
  {
    path: '/coalmine/add',
    name: 'CoalMineAdd',
    component: CoalMineForm,
    meta: {
      active: '/coalmine/list',
      permission: 'mall:coalmine:list:add'
    }
  },
  {
    path: '/coalmine/edit/:id',
    name: 'CoalMineEdit',
    component: CoalMineForm,
    meta: {
      active: '/coalmine/list',
      permission: 'mall:coalmine:list:edit'
    }
  },
  {
    path: '/merchant/list',
    name: 'MerchantList',
    component: MerchantList,
    meta: {
      active: '/merchant/list',
      permission: 'mall:merchant:list:view'
    }
  },
  {
    path: '/merchant/detail/:companyId',
    name: 'MerchantDetail',
    component: MerchantDetail,
    meta: {
      active: '/merchant/list',
      permission: 'mall:merchant:list:view'
    }
  },
  {
    path: '/platform/list',
    name: 'PlatformList',
    component: PlatformList,
    meta: {
      active: '/platform/list',
      permission: 'mall:platform:list:view'
    }
  },
  {
    path: '/platform/detail/:companyId',
    name: 'PlatformDetail',
    component: PlatformDetail,
    meta: {
      active: '/platform/list',
      permission: 'mall:platform:list:view'
    }
  },
  {
    path: '/goods/list',
    name: 'GoodsList',
    component: GoodsList,
    meta: {
      active: '/goods/list',
      permission: 'mall:goods:list:view'
    }
  },
  {
    path: '/goods/detail/:goodsId',
    name: 'GoodsDetail',
    component: GoodsDetail,
    meta: {
      active: '/goods/list',
      permission: 'mall:goods:list:view'
    }
  },
  {
    path: '/goods/check/list',
    name: 'GoodsCheckList',
    component: GoodsCheckList,
    meta: {
      active: '/goods/check/list',
      permission: 'mall:goods:check:view'
    }
  },
  {
    path: '/goods/check/detail/:goodsId',
    name: 'GoodsCheckDetail',
    component: GoodsCheckDetail,
    meta: {
      active: '/goods/check/list',
      permission: 'mall:goods:check:view'
    }
  },
  {
    path: '/goods/mine/price/:goodsId',
    name: 'GoodsMinePrice',
    component: GoodsMinePrice,
    meta: {
      active: '/goods/list',
      permission: 'mall:goods:mineprice:view'
    }
  },
  ...publicRouter.getRouter(store)
];
export default router;
