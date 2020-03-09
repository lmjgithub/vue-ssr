import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: { items: [], testData: "123" },
    mutations: {
      CHANGE_TESTDATA(state, { data }) {
        // Vue.set(state, "testData", data);
        state.testData = data;
      }
    },
    actions: {
      async changeTestData({ commit }) {
        try {
          const a = await new Promise(resolve => {
            setTimeout(() => {
              const date = +new Date();
              resolve(date);
            }, 3000);
          });
          commit("CHANGE_TESTDATA", { data: a });
        } catch (error) {}
      }
    }
  });
}
