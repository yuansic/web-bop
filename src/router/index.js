import publicRouter from './publicRouter';
import Login from '@/views/index/Login';

var router = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  ...publicRouter.getRouter()
];

export default router;
