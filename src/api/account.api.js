import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------资金账户---------- */
// 账户首页 GET
api.account = baseURL + '/account/queryCashAccountDetail';
// 提现预览
api.withdrawPre = baseURL + '/account/withdrawPreview';
// 提现支付
api.withdrawCash = baseURL + '/account/withdrawPay';

// 余额明细列表
api.queryBalanceDetailList = baseURL + '/account/queryBalanceDetailList';
// 货款付款明细列表
api.queryOrderPaymentList = baseURL + '/account/queryOrderPaymentList';
// 货款收货明细列表
api.queryReceiveOrderPaymentList = baseURL + '/account/queryReceiveOrderPaymentList';
// 货款支付明细详情
api.queryOrderPaymentDetail = baseURL + '/account/queryOrderPaymentDetail';

// 余额明细导出
api.balanceDetailListExport = baseURL + '/download/balanceDetailListExport';
// 货款付款明细导出
api.orderPaymentListExport = baseURL + '/download/orderPaymentListExport';
// 货款收款明细导出
api.orderReceivePaymentListExport = baseURL + '/download/orderReceivePaymentListExport';

// 设置、修改、忘记支付密码
api.editpaypass = baseURL + '/account/passwordOperate';
// 验证支付密码
api.pwdvalidate = baseURL + '/account/passwordValid';
//未开票列表
api.pendingProtocolBillList = baseURL + '/bill/pendingProtocolBillList';
//已开票列表
api.completeProtocolBillList = baseURL + '/bill/completeProtocolBillList';
//申请开票列表
api.applyProtocolBillList = baseURL + '/bill/applyProtocolBillList';
//申请开票
api.applyProtocolBill = baseURL + '/bill/applyProtocolBill';
//维护开票信息
api.disposeProtocolBill = baseURL + '/bill/disposeProtocolBill';
//查询开票信息
api.detailProtocolBill = baseURL + '/bill/detailProtocolBill';
//查询开票 发票头信息
api.recipientsProtocolBillDetail = baseURL + '/bill/recipientsProtocolBillDetail';
//查询开票 合同信息
api.completeProtocolBillDetail = baseURL + '/bill/completeProtocolBillDetail';

//矿场资金列表
api.coalMineCapitalList = baseURL + '/company/coalMineCapital/list';
//矿场资金明细列表
api.coalMineCapitalLogList = baseURL + '/company/coalMineCapitalLog/list';
//矿场资金人工修正
api.coalMineCapitalUpdate = baseURL + '/company/coalMineCapital/update';
//矿场资金-煤矿下拉选项
api.coalMineCapitaSuplist = baseURL + '/company/goods/coalMineList';

export default api;
