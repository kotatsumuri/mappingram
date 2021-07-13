import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userNames: {},
    user: {}
  },

  mutations: {
    setUserNames: function(state, value) {
      state.userNames = value;
    },
    setUserInfo: function(state, _user) {
      state.user = _user;
		}
  },
  actions: {},
  getters: {
    userNames: function(state) {
      return state.userNames;
    },
    user: function(state) {
      return state.user;
    }
  },
});
