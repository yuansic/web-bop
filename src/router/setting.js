import publicRouter from './publicRouter';
import store from '@/store/setting/index';

// 布局设置
const LayoutSet = () => import('@/views/setting/LayoutSet');
// 菜单管理
const MenuMng = () => import('@/views/setting/MenuMng');
// 菜单编辑
const MenuEdit = () => import('@/views/setting/MenuEdit');
// 角色权限管理
const RoleList = () => import('@/views/setting/RoleList');
// 角色查看/添加/编辑
const RoleEdit = () => import('@/views/setting/RoleEdit');
// 用户管理
const UserList = () => import('@/views/setting/UserList');
// 用户添加/编辑
const UserEdit = () => import('@/views/setting/UserEdit');

var router = [
  {
    path: '/menu/mng',
    name: 'MenuMng',
    component: MenuMng,
    meta: {
      active: '/menu/mng',
      permission: 'setting:sys:menu:view'
    }
  },
  {
    path: '/menu/add',
    name: 'MenuAdd',
    component: MenuEdit,
    meta: {
      active: '/menu/mng',
      permission: 'setting:sys:menu:add'
    }
  },
  {
    path: '/menu/add/:parentId',
    name: 'MenuSubAdd',
    component: MenuEdit,
    meta: {
      active: '/menu/mng',
      permission: 'setting:sys:menu:add'
    }
  },
  {
    path: '/menu/edit/:menuid',
    name: 'MenuEdit',
    component: MenuEdit,
    meta: {
      active: '/menu/mng',
      permission: 'setting:sys:menu:edit'
    }
  },
  {
    path: '/role/list',
    name: 'RoleList',
    component: RoleList,
    meta: {
      active: '/role/list',
      permission: 'setting:sys:role:view'
    }
  },
  {
    path: '/role/add',
    name: 'RoleAdd',
    component: RoleEdit,
    meta: {
      active: '/role/list',
      permission: 'setting:sys:role:add'
    }
  },
  {
    path: '/role/edit/:id',
    name: 'RoleEdit',
    component: RoleEdit,
    meta: {
      active: '/role/list',
      permission: 'setting:sys:role:edit'
    }
  },
  {
    path: '/role/view/:id',
    name: 'RoleView',
    component: RoleEdit,
    meta: {
      active: '/role/list',
      permission: 'setting:sys:role:view'
    }
  },
  {
    path: '/user/list',
    name: 'UserList',
    component: UserList,
    meta: {
      active: '/user/list',
      permission: 'setting:sys:user:view'
    }
  },
  {
    path: '/user/view/:id',
    name: 'UserView',
    component: UserEdit,
    meta: {
      active: '/user/list',
      permission: 'setting:sys:user:view'
    }
  },
  {
    path: '/user/add',
    name: 'userAdd',
    component: UserEdit,
    meta: {
      active: '/user/list',
      permission: 'setting:sys:user:add'
    }
  },
  {
    path: '/user/edit/:id',
    name: 'UserEdit',
    component: UserEdit,
    meta: {
      active: '/user/list',
      permission: 'setting:sys:user:edit'
    }
  },
  {
    path: '/layoutset',
    name: 'LayoutSet',
    component: LayoutSet,
    meta: {
      active: '/layoutset',
      permission: 'setting:sys:layout:view'
    }
  },
  ...publicRouter.getRouter(store)
];
export default router;
