import * as types from './types';

// 这是修改state的入口
// 定义方法  读取type   提交conmit
// conmit操作对象指向mutation  mutation修改state
export default {
  // 同步全局配置
  changeGlobal({ commit }, data) {
    commit(types.CHANGE_GLOBAL, data);
  },
  // 同步侧栏选中项
  changeSideAction({ commit }, data) {
    commit(types.CHANGE_SIDEACTION, data);
  },
  // 同步省市区数据
  changeRegion({ commit }, data) {
    commit(types.CHANGE_REGION, data);
  },
  // 同步权限数据
  changePermission({ commit }, data) {
    commit(types.CHANGE_PERMISSION, data);
  },
  // 同步导航菜单数据
  changeMenuTree({ commit }, data) {
    commit(types.CHANGE_MENUTREE, data);
  },
  // 设置消息数据
  setNoticeData({ commit }, data) {
    commit(types.SET_NOTICE_DATA, data);
  }
};
