import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userNames: {},
    user: {},
    post:{}
  },

  mutations: {
    setUserNames: function(state, value) {
      state.userNames = value;
    },
    setUserInfo: function(state, _user) {
      state.user = _user;
		},
    setPost: function(state, value) {
      state.post = value;
    },
    logout: function(state) {
      state.userNames = {};
      state.user = {};
      state.post = {};
    }
  },
  actions: {},
  getters: {
    userNames: function(state) {
      return state.userNames;
    },
    user: function(state) {
      return state.user;
    },
    post: function(state) {
      if(state.post == null)
        return {};
      return state.post;
    },
    
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    key: 'mappingram'
  })]
});
