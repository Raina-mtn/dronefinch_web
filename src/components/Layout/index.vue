<template>
  <!--  <VScaleScreen id="rootScreen" :boxStyle="{ 'background-color': '#081F4D' }" width="1920" height="1080" delay="100">-->
  <div class="layout-content" @mouseover="onmouseovered">
    <Header v-show="needLayout" />
    <div :class="['layout-route-view',!needLayout && 'noLayout']">
      <router-view></router-view>
    </div>
  </div>
  <!--  </VScaleScreen>-->
</template>

<script setup lang="ts">
import Header from "./header/index.vue";
import { ElMessageBox } from "element-plus";
import { userStore } from "@/store/index";
import {useRoute } from "vue-router";
import {watch, Ref} from "vue";
import { useWebSocket } from "@vueuse/core";
import { ElNotification } from "element-plus";

const useUserStore = userStore();
const route = useRoute();

import autofit from "autofit.js";
import { onMounted, ref, onUnmounted } from "vue";
let timer = ref();
let needLayout:Ref = ref(true);//顶部导航是否需要 默认有

// webscoket的方法
let wsOpenGlobal: any = null;
let wsCloseGloabl: any = null;
let wsSendGlobal: any = null;

watch(route, (val) => {
  needLayout.value = val.meta.needLayout ?? true;
});



onMounted(() => {
  needLayout.value = route.meta.needLayout ?? true;
  autofit.init({
    el: ".layout-content",
    dh: 1080,
    dw: 1920,
    resize: true,
    ignore: [
      { 
        el: [".control-bottom-progress", ".map-scale-container"],
      },
    ],
  });

  openWs();

});

onUnmounted(() => {
  clearTimeout(timer.value);
  wsCloseGloabl && wsCloseGloabl();
});

function onmouseovered () {
  clearTimeout(timer.value);
  countTime();
}

function countTime () {
  timer.value = setTimeout(function () {

    ElMessageBox.alert(
      "您在30min内未进行任何操作，即将自动结束会话",
      "提示",
    ).then(() => {
      useUserStore.logout();
    });
    setTimeout(() => {
      ElMessageBox.close();
      useUserStore.logout();
      clearTimeout(timer.value);
    }, 3000);
  }, 30 * 60 * 1000);
}


// 创建ws
const openWs = () => {
  // websocket
  const { data, send, open, close } = useWebSocket(import.meta.env.VITE_WS_URL + "net/websocket/b", {
    // autoClose:false,
    // autoReconnect: true,
  });

  wsCloseGloabl = close;
  wsOpenGlobal = open;
  wsSendGlobal = send;

  watch(data, (val) => {
    if (!val) return;
    const res = JSON.parse(val);
    // console.log("ws来消息了======>", res);
    wsDataAssign(res);

  });
};

// ws接受数据处理
const wsDataAssign = (val) => {
  // 200 300  1 2 3 4这些都是后端ws数据返回的值 用来判断返回是哪些数据
  switch (val.Address) {
  case 200:
    // 全局设备告警提醒
    if (val.FunCode === 4) {
      openNotifiction(val.data);
    }
    break;
  default:
    break;
  }
};

// 全局告警提醒
const openNotifiction = (data) => {
  ElNotification({
    title: "注意",
    type: "warning",
    position: "bottom-right",
    dangerouslyUseHTMLString: true,
    message: `${data.alarmMessage},告警时间${data.alarmTime}`,
  });
};

</script>

<style lang="scss" scoped>
.layout-content {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color:rgba(8, 31, 77, 1);

  .layout-route-view {
    width: 100%;
    flex: 1;
    max-height: calc(100% - 130px);
    padding: 24px;
    &.noLayout{
      padding: 0;
      max-height: 100%;
    }
  }
}

</style>
