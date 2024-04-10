import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { setupStore } from "@/store";
import { setupRouter } from "@/router";
import { registerComponent } from "@/components/registerComponent";
import { setupVueCesium } from "@/plugins/vue-cesium";
import { setupMitt } from "@/plugins/mitt";

import "vue-cesium/dist/index.css";
import "virtual:windi.css";
import "@/assets/font/iconfont.css";
import "@/assets/icon/iconfont.css";
import "@/styles/element/index.scss";


const app = createApp(App);
// 注册store
setupStore(app);

// 注册路由
setupRouter(app);

// 注册vue-cesium
setupVueCesium(app);

// 注册事件总线mitt
setupMitt(app);


// 注册全局组件
registerComponent(app);


app.mount("#app");
