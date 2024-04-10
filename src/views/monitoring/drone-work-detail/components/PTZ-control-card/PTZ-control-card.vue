<!--
 * @Author: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @Date: 2023-11-07 14:10:39
 * @LastEditors: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @LastEditTime: 2023-11-21 15:01:10
 * @FilePath: \dronefinch_web\src\views\monitoring\drone-work-detail\components\PTZ-control-card\PTZ-control-card.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="flex justify-between p-6 pl-3.5">
      <div class="flex flex-col items-center justify-around w-37 relative">
          <div 
              v-for="i in PTZResetList" 
              :key="i.value" 
              @click="onControl(i.value)"
              class='flex button-item w-25 h-8 rounded  flex-col items-center justify-center cursor-pointer my-1'
            >
            {{ i.name }}
          </div>
      </div> 
      <div class="flex items-center">
        <div class="zoom-control">
            <div v-for="item in zoomList" @click="onChangeZoom(item.value)" :class="['zoom-item relative cursor-pointer flex pb-8',{active:item.value === selectZoom}]" :key="item.value">
                <div class="zoom-line  w-1px bg-white absolute top-3 left-0"></div>
                <div class="zoom-icon w-6 h-6 absolute -left-3"></div>
                <div class="zoom-text ml-21px">{{ item.value }}X</div>
            </div>
        </div>
      </div>
      <div class="control-button">
          <div @click="takePhoto(1)" class="flex w-21 h-17.5 button-item rounded flex-col items-center justify-center cursor-pointer my-1">
              <el-icon class="text-3xl"><Camera /></el-icon>
              <span class="text-xs">拍照</span>
          </div>
          <div @click="takePhoto(2)" class="flex w-21 h-17.5 button-item rounded flex-col items-center justify-center cursor-pointer  my-1">
              <el-icon class="text-3xl"><VideoCamera /></el-icon>
              <span class="text-xs">开始录像</span>
          </div>
          <div @click="takePhoto(3)" class="flex w-21 h-17.5 button-item rounded flex-col items-center justify-center cursor-pointer  my-1">
              <el-icon class="text-3xl"><VideoPause /></el-icon>
              <span class="text-xs">结束录像</span>
          </div>
      </div> 
  
    </div>
  </template>
<script setup lang="ts"> 
import {ref, reactive} from "vue";
import {PTZResetList} from "../../static-data";

const emit = defineEmits(["onReset", "onChangeZoom", "takePhoto"]);
const selectZoom = ref(0);

const zoomList = [
  {value:200},
  {value:50},
  {value:20},
  {value:4},
];
  
// 重置云台事件
const onControl = (val) => {
  emit("onReset", val);
};
  
// 云台变焦
const onChangeZoom = (val) => {
  selectZoom.value = val;
  emit("onChangeZoom", val);
};
  
// takePhoto
const takePhoto = (val) => {
  emit("takePhoto", val);
};
  
  
</script>
  <style lang="scss" scoped>
  @import './PTZ-control-card.scss'
  
  
  
  </style>
  