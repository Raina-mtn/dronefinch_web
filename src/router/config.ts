import type { RouteRecordRaw } from "vue-router";

// 默认路由白名单
export const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import("@/components/Layout/index.vue"),
        children: [],
      },
      {
        path: "login",
        name: "login",
        component: () => import("@/views/login/index.vue"),
      },
      {
        path: "404",
        name: "notFound",
        component: () => import("@/views/404/index.vue"), //这个是我自己的路径
      },
    ],
  },
];
