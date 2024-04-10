<template>
    <div class="">
      <video 
        v-if="show" 
        @contextmenu="contextmenu" 
        src="" 
        disablePictureInPicture="true" 
        ref="videodom" 
        controlslist="nodownload " 
        autoplay 
        controls 
        class="w-full h-full"
        style="object-fit: cover"
        @timeupdate="timeupdate"
      >
      </video>
      <slot></slot>
    </div>
  </template>
<script setup lang="ts">
import {ref, reactive, watch, onMounted, nextTick, onUnmounted, getCurrentInstance  } from "vue";
import flvjs from "flv.js";
import FlvExtend from "flv-extend";
  
  
  interface Props {
    videoSrc?: string;
    from?: string;
    isPreview?:boolean
  }
  
const props = withDefaults(defineProps<Props>(), {
  videoSrc:"",
  isPreview:false,
  from:"",
});
const show = ref(true);
const videodom = ref<HTMLVideoElement | null>(null);
let player ;
  
// 在setup函数中获取实例对象并定义bus
const instance = getCurrentInstance();
const bus = instance?.appContext.config.globalProperties.$bus;
  
watch(() => props.videoSrc, async (newVal, oldVal) => {
  if (newVal !== oldVal){
    await nextTick();
    playVideo();
  }
});
  
onMounted(() => {
  props.isPreview && bus.on("updateCurrentTime", updateCurrentVideoTime);
  playVideo();
});
  
onUnmounted(() => {
  destroyVideo();
  props.isPreview && bus.off("updateCurrentTime", updateCurrentVideoTime);
  
});
  
// 播放视频
const playVideo = () => {
  // console.log("开始播放", props.videoSrc);
  if (!flvjs.isSupported()) return;
  let video = videodom.value;
  if (!video) return;
  if (player) {
    destroyVideo();
  }
  const flv = new FlvExtend({
    element: video, // *必传
    frameTracking: true, // 开启追帧设置
    updateOnStart: true, // 点击播放后更新视频 
    updateOnFocus: true, // 获得焦点后更新视频
    reconnect: true, // 开启断流重连 
    reconnectInterval: 0, // 断流重连间隔
    trackingDelta: 5,
    trackingPlaybackRate: 1.5,
  });
  player = flv.init(
    {
      type: "flv",
      isLive: !props.isPreview,
      hasAudio: false,
      url:  props.videoSrc,
    },
    {
      // enableWorker: true, // 启用分离的线程进行转换
      // enableStashBuffer: false, // 如果您需要实时（最小延迟）来进行实时流播放，则设置为false
      autoCleanupSourceBuffer: true, // 对SourceBuffer进行自动清理
      stashInitialSize: 128, // 减少首帧显示等待时长
    },
  );
  try {
    player.play();
    player.onerror = (e) => {
      console.log("播放错误", e);
    };
    // player.onstats=(e => {
    //   console.log('播放状态', e)
    // })
    player.onmedia = (e) => {
      // console.log("媒体信息", e);
    };
  
    // 【重要事件监听】http请求建立好后，该事件会一直监听flvjs实例
    //player.on(flvjs.Events.STATISTICS_INFO, (res) => {
    //   console.log("请求数据信息",res)
    // })
    // console.log("play");
  } catch (error) {
    console.log(error);
  }
};
  
  
// 视频更新
let start = 0;//视频timeupdate事件比一秒短 触发过于频繁 做了限制 1s emit一次
const timeupdate = (e) => {
  // 预览return 或者 无人机视频更新事件触发
  if (!props.isPreview || !["drone"].includes(props.from)) return;
  let end = Date.now();
  if (end - start >= 1000) {
    start = end;
    bus.emit("videoPlaying", {time:e.target.currentTime, from:props.from});
  }
  // console.log(e.target.currentTime);
};
  
// 更新video当前时间
const updateCurrentVideoTime = ({seconds}) => {
  // console.log('改变进度' + value);
  player.currentTime = seconds;
  player.play();
};
  
// 视频销毁
const destroyVideo = () => {
  if (player) {
    player.close();
    player = null;
  }
};
  
  
  
// 拦截右键事件
const contextmenu = (e) => {
  e.preventDefault();
};
  
  
</script>
  <style lang="scss" scoped>
  @import './rtmp-video.scss'
  
  
  
  </style>
  