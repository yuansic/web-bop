// 公用部分api

import config from '@/config/config';
let api = {};

const baseURL = config.baseURL;
api.baseURL = baseURL;

/* ----------公共接口---------- */

// 文件上传
api.upload = config.uploadURL + '/common/api/file/upload';
// 查询用户菜单权限树
api.queryUserMenuListTree = baseURL + '/sysMenu/queryUserMenuListTree';
// 查询全部字典
api.getSysDictByAll = baseURL + '/sysDict/getSysDictByAll';
// 查询指定key的字典
api.getSysDictByType = baseURL + '/sysDict/getSysDictByType';

export default api;
