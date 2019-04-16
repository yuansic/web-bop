import * as types from './types';
// 由mutation来修改state
const mutations = {
  [types.CHANGE_GLOBAL]: function(state, data) {
    state.g_config = data;
  },
  [types.CHANGE_SIDEACTION]: function(state, data) {
    state.sideAction = data;
  },
  [types.CHANGE_REGION]: function(state, data) {
    state.regionData = data;
  },
  [types.CHANGE_PERMISSION]: function(state, data) {
    state.permission = data;
  },
  [types.CHANGE_MENUTREE]: function(state, data) {
    state.menuTree = data;
  },
  [types.SET_NOTICE_DATA]: function(state, data) {
    state.noticeData = data;
  }
};
export default mutations;
