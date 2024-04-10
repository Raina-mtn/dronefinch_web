<template>
    <div class="detail p-6">
      <div class="flex">
        <div class="logo">
          <img :src="type==='1'?imagesMap['airport-avatar']:imagesMap['drone-avatar']" />
        </div>
        <div class="flex flex-col justify-between pl-4">
          <div>
            <div class="flex items-center">
              <div class="text-lg font-medium">{{detail.dataName}}</div>
              <div class="status-tag text-xs px-3 ml-2.5 flex items-center">{{detail.deviceStatusName}}</div>
            </div>
            <!-- 线路 sn -->
            <div class="flex items-center text-sm mt-2.5">
              <div class="mr-15" v-for="(i,index) in infoData" :key="index">
                <span class="text-opacity-50">{{i.title}}：</span>
                <span>{{detail[i.prop]}}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center text-sm">
            <div class="desc-item px-30px" v-for="(i,index) in infoDetailData" :key="index" >
              <div class="text-opacity-50">{{i.title}}</div>
              <div>
                <span class="text-xl">{{detail[i.prop] }}</span>
                <span class="text-opacity-50" v-if="i.unit">{{ i.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 视频 -->
      <div class="flex justify-center items-center video-box mt-4">
        <RtmpVideo v-if="videoSrc" :videoSrc="videoSrc" class="w-full h-full relative">
          <div  class="url-select absolute top-4 right-4">
            <el-select 
              v-if="detail.videoList && detail.videoList.length>1"
              v-model="videoSrc" 
              class="m-2" 
              size="large" 
            >
              <el-option
                v-for="item in detail.videoList"
                :key="item.cameraId"
                :label="item.cameraName"
                :value="item.videoUrl"
              />
            </el-select>
          </div>
        </RtmpVideo>
        <img v-else src="@/assets/images/no-video.png" class="empty">
      </div>
    </div>
  </template>
<script setup lang="ts">
import {ref, reactive, computed, onMounted} from "vue";
import RtmpVideo from "../rtmp-video/rtmp-video.vue";
import {droneData, airportData, infoList} from "./config";
import imagesMap from "@/assets/images_js";

interface Props {
  detail?:{ [key: string]: any},
  type?:"1" | "2"//1机场 2无人机
}
  
const props = withDefaults(defineProps<Props>(), {
  detail: () => ({     
  }),
  type:"1",
});
  
// 视频地址
let videoSrc = ref("");

// 详细数据 累计时长等
const infoDetailData = computed(() => {
  return props.type === "1" ? airportData : droneData;  
});

// 线路 sn数据
const infoData = computed(() => {
  return props.type === "1" ? infoList : infoList.slice(1);  
});

onMounted(() => {
  videoSrc.value =  props.detail.videoList?.length ? props.detail.videoList[0].videoUrl : "";
});
  
  
  
</script>
  <style lang="scss" scoped>
  @import './device-detail-item.scss'
  
  
  
  </style>
  