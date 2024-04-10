import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import WindiCSS from "vite-plugin-windicss";
import vueJsx from "@vitejs/plugin-vue-jsx";
import externalGlobals from "rollup-plugin-external-globals";


// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  server: {
    host: true,
    proxy: {
      "/api": {
        // target: 'http://172.19.3.100:8090/', 
        target: "http://172.16.160.250:8090/", //线上
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp("^/api"), ""),
        secure: false, // https is require secure=false
      }
    },
  },
  plugins: [vue(), WindiCSS(), vueJsx()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@images": resolve(__dirname, "src/assets/images"),
    },
  },
  build: {
    rollupOptions: {
      external: ["element-china-area-data"],
    },
  },
});
