import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------设置模块---------- */

// 查询完整菜单树
api.queryAllMenuListTree = baseURL + '/sysMenu/queryAllMenuListTree';
// 删除菜单
api.deleteMenuInfo = baseURL + '/sysMenu/deleteMenuInfo';
// 保存菜单
api.saveMenuInfo = baseURL + '/sysMenu/saveMenuInfo';
// 查询菜单详情
api.queryMenuDetailForId = baseURL + '/sysMenu/queryMenuDetailForId';

// 角色列表(分页)
api.querySysRoleList = baseURL + '/sysRole/querySysRoleList';
// 角色列表(全部)
api.queryAllList = baseURL + '/sysRole/queryAllList';
// 新增角色
api.saveSysRoleInfo = baseURL + '/sysRole/saveSysRoleInfo';
// 角色详情
api.querySysRoleDetailInfo = baseURL + '/sysRole/querySysRoleDetailInfo';
// 删除角色
api.deleteSysRoleInfo = baseURL + '/sysRole/deleteSysRoleInfo';

// 用户列表
api.querySysUserList = baseURL + '/sysUser/querySysUserList';
// 新增用户
api.saveSysUser = baseURL + '/sysUser/saveSysUser';
// 修改用户
api.updateSysUserById = baseURL + '/sysUser/updateSysUserById';
// 用户详情
api.getSysUserById = baseURL + '/sysUser/getSysUserById';
// 删除用户
api.deleteSysUser = baseURL + '/sysUser/deleteSysUser';
// 启用/禁用登录
api.enableAndProhibit = baseURL + '/sysUser/enableAndProhibit';

export default api;
