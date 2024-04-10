import mitt from "mitt";
import type { App } from "vue";
const bus = mitt();
// 启动函数
export function setupMitt (app: App<Element>) {
// 再注册全局事件总线
  app.config.globalProperties.$bus = bus;
}