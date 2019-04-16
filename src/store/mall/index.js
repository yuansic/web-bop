import Vue from 'vue';
import Vuex from 'vuex';
import self_mutations from './mutations';
import self_actions from './actions';

import globalStore from '../global/index';

Vue.use(Vuex);

// state
const state = {
  ...globalStore.state,
  selfPage: 'mall'
};
// mutations
const mutations = {
  ...globalStore.mutations,
  ...self_mutations
};
// actions
const actions = {
  ...globalStore.actions,
  ...self_actions
};

export default new Vuex.Store({
  state,
  mutations,
  actions
});
