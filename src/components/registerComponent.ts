import type { App } from 'vue';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/styles/element/index.scss'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

export function registerComponent(app: App) {
  app.use(ElementPlus, {
    locale: zhCn,
  })
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
