import { userStore } from "@/store/modules/user";
import { router } from "./index";
import { RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";
import LoadingComponent from "@/components/Loading.vue";

export const beforeEachInterceptor = async (to: any, _from: any, next: any) => {
  const useUserStore = userStore();
  if (to.matched.length) {
    useUserStore.setMatched(to.matched);
    // 已匹配路由
    return next();
  } else {
    // 未匹配路由

    // 权限路由设置
    const { isLogin, getUserAuthRoute, route } = useUserStore;
    if (!isLogin) {
      // 没登录
      return next(`/login?redirect=${to.path}`);
    } else {
      if (route.auth.added) {
        // 已经添加过
        console.log("未识别");
        return next("/404");
      }

      // 未添加过
      const authRouteData = await getUserAuthRoute();
      const authRoutesGenerated: RouteRecordRaw[] = generateRoute(authRouteData);
      for (const iterator of authRoutesGenerated) {
        router.addRoute("Home", iterator);
      }
      route.auth.added = true;
      next(to);
    }
  }
};


const views = import.meta.glob("../views/**/*.vue");
// console.log(views);

function generateRoute (routeArray: Array<any>): RouteRecordRaw[] {
  if (routeArray.length <= 0) {
    return [];
  }

  const routes: RouteRecordRaw[] = routeArray.reduce((previous, currentValue) => {
    const { name: title, path, icon, meta,children = [], component } = currentValue;
    const routeItem: RouteRecordRaw = {
      path,
      meta: { title, icon,...meta },
      children: generateRoute(children),
      component: defineAsyncComponent({
        // @ts-ignore
        loader: views[".." + component],
        // loader: async ()=> LoadingComponent,
        loadingComponent: LoadingComponent,
      }),
      // component: defineAsyncComponent(() => import('..' + component))
    };
    previous.push(routeItem);
    return previous;
  }, []);
  return routes;
}
