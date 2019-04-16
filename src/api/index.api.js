import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------煤炭商城---------- */

// 企业登入
api.login = baseURL + '/sysUser/login';
// 获取用户信息
api.getSysUser = baseURL + '/sysUser/getSysUser';

export default api;
