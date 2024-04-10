<template>
    <div class="flex justify-between items-center mr-10">
      <div class="control-box w-35 h-35 relative">
          <div 
              v-for="i in arrowList" 
              :key="i.value" 
              :class="['cursor-pointer control-button absolute',i.class]"
              @mousedown="onControl('start',i.value)" 
              @mouseup="onControl('stop',i.value)">
          </div>
      </div> 
    </div>
  </template>
<script setup lang="ts"> 
import {ref,reactive} from "vue";
  
const emit = defineEmits(['onControl']);
// 向上+h，向下-h，左转-w，右转+w
const arrowList = [
  {value:'+h',class:'up'},
  {value:'-h',class:'down'},
  {value:'-w',class:'left'},
  {value:'+w',class:'right'},
];
  
// 云台方向控制
const onControl = (...params) => {
  emit('onControl',params);
};
  
  
  
  
</script>
  <style lang="scss" scoped>
  @import './drone-control-z.scss'
  
  
  
  </style>
  