import VueCesium from 'vue-cesium';
import type { App } from 'vue';

// 启动函数
export function setupVueCesium(app: App<Element>) {
// 由于Cesium更新可能有破坏性更新，建议在生产环境中锁定 Cesium 版本
    app.use(VueCesium, {
        cesiumPath: '/lib/Cesium/Cesium.js',
    });
}