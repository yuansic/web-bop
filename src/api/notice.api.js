import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------采购管理---------- */

// 消息列表
api.sysMsgList = baseURL + '/common/sysmsg/list';
// 消息详情
// api.sysMsgDetail = baseURL + '/common/sysmsg/detail';
// 标记为已读
api.sysMsgRead = baseURL + '/common/sysmsg/read';
// 全部标记为已读
api.sysMsgAllRead = baseURL + '/common/sysmsg/allRead';

export default api;
