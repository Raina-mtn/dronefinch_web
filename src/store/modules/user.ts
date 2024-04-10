/*
 * @Author: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @Date: 2023-11-30 14:31:03
 * @LastEditors: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @LastEditTime: 2023-12-01 09:52:31
 * @FilePath: \dronefinch_web\src\store\modules\user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia";
import { apiGetUserMenu, login, logout, apiGetUserBaseInfo, apiGetAuthImage } from "@/api/interface";
import menu from "@/mock/menu.js";
import { router } from "@/router";
import { ElMessage as createMessage } from "element-plus";

export const userStore = defineStore({
  id: "user", // 必须指明唯一的pinia仓库的id
  state: () => ({
    // token
    token: "",
    tokenExpired: "", // 登录令牌
    refreshToken: "",

    // 路由相关
    route: {
      matched: [],
      // 权限路由
      auth: {
        added: false,
        // routes: menu,
        routes: [],
      },
    },

    // 登录相关
    isLogin: false, 
    userInfo: {
      userName: "",
      userId: "",
    }, // 用户信息
  }),
  actions: {
    // 登录
    async login (username: string, password: string) {
      const params = new FormData();
      params.append("username", username);
      params.append("pass", password);
      //   params.append("ucode", "");
      // params.append('grant_type', 'password');
      const {
        data,
      } = await login(params);
            
      //   this.token = `Bearer ${data}`;

      this.token = data;
      await this.getUserBaseInfo();
      // this.tokenExpired = expires_in;
      // this.refreshToken = refresh_token;
      // this.userInfo.userName = userName;
      // this.userInfo.userId = userId;
      this.isLogin = true;
    },

    async logout () {
      await logout();
      createMessage.success("退出成功");
      this.$reset();
      router.replace("/login");

    },
    async getUserBaseInfo () {
      const { data: {
        username, id,
      } } = await apiGetUserBaseInfo();      
      this.userInfo.userName = username;
      this.userInfo.userId = id;
    },

    async getUserAuthRoute () {
      if (this.route.auth.routes.length <= 0) {
        const data = await apiGetUserMenu();
        this.route.auth.routes = data.data;
      }
      return this.route.auth.routes;
    },


    async setMatched (matched: any) {
      this.route.matched = matched;
    },

    async getAuthImage () {
      const { data } = await apiGetAuthImage();
      return data;
    },
  },
  getters: {
    userName: (state) => state.userInfo.userName,
  },
  persist: {
    key: "storge_user",
    paths: ["token", "userInfo", "isLogin", "route.auth.routes"],
  },
});
