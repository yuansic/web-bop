import publicRouter from './publicRouter';
import store from '@/store/mycenter/index';

import Welcome from '@/views/mycenter/Welcome';

var router = [
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome,
    meta: {
      active: '/welcome',
      permission: 'my:workplace:wlecome:view'
    }
  },
  ...publicRouter.getRouter(store)
];
export default router;
