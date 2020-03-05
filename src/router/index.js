import Vue from "vue";
import Router from "vue-router";
import DefaultLayout from "@/layout/DefaultLayout";

Vue.use(Router);

const routerConfig = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: '',
        redirect:'/process-pool'
      },
      {
        path: "process-pool",
        component: () => import("@/pages/process-pool/index")
      },
      {
        path: "public-pool",
        component: () => import("@/pages/public-pool/index")
      }
    ]
  }
  /* {
    path: "*",
    redirect: "/"
  } */
];

export function createRouter() {
  return new Router({
    base: __dirname,
    mode: "history",
    routes: routerConfig
  });
}
