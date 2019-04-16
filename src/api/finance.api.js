import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------设置模块---------- */

// 交易流水管理 查询交易流水列表
api.payFundFlowQueryOrderInfoForPage = baseURL + '/payFundFlow/queryOrderInfoForPage';

// 外部账户资金变动 查询外部账户资金变动列表
api.queryAcctExternalChgInfoForPage =
  baseURL + '/acctExternalChgInfo/queryAcctExternalChgInfoForPage';

// 支付订单管理 查询支付订单列表
api.queryOrderInfoForPage = baseURL + '/payOrder/queryOrderInfoForPage';

export default api;
