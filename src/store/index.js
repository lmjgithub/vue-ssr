import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: { items: [], testData: "123" },
    mutations: {
      CHANGE_TESTDATA(state, { data }) {
        // Vue.set(state.testData, data)
        state.testData = data;
      }
    },
    actions: {
      changeTestData({ commit }) {
        commit("CHANGE_TESTDATA", { data: +new Date() });
      }
    }
  });
}
