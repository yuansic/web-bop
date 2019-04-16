import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------煤链社商城---------- */

// 待确认订单列表
api.queryBopProtocolOrderList = baseURL + '/tradeProtocolOrder/queryBopProtocolOrderList';
// 待确认订单详情
api.queryBopProtocolOrderDtail = baseURL + '/tradeProtocolOrder/queryBopProtocolOrderDtail';
// 确认订单
api.confirmCarrier = baseURL + '/tradeProtocolOrder/confirmCarrier';
// 关闭订单
api.finClose = baseURL + '/tradeProtocolOrder/finClose';
// 查询物流公司
api.queryFullName = baseURL + '/tradeProtocolOrder/queryFullName';
// 查询煤款流向的供应链账户信息
api.getAcctExternalByUserCode = baseURL + '/acctExternalChgInfo/getAcctExternalByUserCode';
// 查询煤款流向的煤矿账户信息
api.queryBdCoalMineAccout = baseURL + '/tradeProtocolOrder/queryBdCoalMineAccout';
// 查询审核日志
api.selectGoodsAuditList = baseURL + '/tradeGoods/selectGoodsAuditList';

// 贸易公司列表
api.companyList = baseURL + '/trade/companyList';
// 平台公司列表
api.companyListFin = baseURL + '/trade/companyListFin';
// 贸易公司详情
api.queryCompayDetailById = baseURL + '/trade/queryCompayDetailById';

// 查询商户已关联的煤矿列表
api.selectCompanyCoalMineList = baseURL + '/trade/selectCompanyCoalMineList';
// 查询未关联的煤矿列表
api.selectNotCompanyCoalMineList = baseURL + '/trade/selectNotCompanyCoalMineList';
// 商户新增煤矿关联
api.saveCompanyCoalMine = baseURL + '/trade/saveCompanyCoalMine';

// 查询经纪人已关联的供应链列表
api.selectCompanyRelation = baseURL + '/trade/selectCompanyRelation';
// 查询经纪人未关联的供应链列表
api.selectNotCompanyRelation = baseURL + '/trade/selectNotCompanyRelation';
// 经纪人新增供应链关联关系
api.saveCompanyRelationship = baseURL + '/trade/saveCompanyRelationship';

// 商户删除关联关系
api.deleteCompanyCoalMine = baseURL + '/trade/deleteCompanyCoalMine';

// 贸易公司列表
api.companyList = baseURL + '/trade/companyList';

// 商品列表
api.goodsFindList = baseURL + '/tradeGoods/findList';
// 审核商品
api.goodsAudit = baseURL + '/tradeGoods/audit';
// 商品详情
api.goodsFindDetail = baseURL + '/tradeGoods/findDetail';
// 商品矿发煤价列表
api.selectGoodsMinePrice = baseURL + '/tradeGoods/selectGoodsMinePrice';
// 新增商品矿发煤价
api.saveGoodsMinePrice = baseURL + '/tradeGoods/saveGoodsMinePrice';

// 煤矿列表 全部
api.selectCoalMineList = baseURL + '/trade/selectCoalMineList';
// 煤矿详情
api.selectCoalMineDetail = baseURL + '/trade/selectCoalMineDetail';
// 查询供应链已关联煤矿列表
api.selectCompanyCoalMineRealtionList = baseURL + '/trade/selectCompanyCoalMineRealtionList';
// 查询供应链未关联煤矿列表
api.selectNotCompanyCoalMineRealtionList = baseURL + '/trade/selectNotCompanyCoalMineRealtionList';

export default api;
