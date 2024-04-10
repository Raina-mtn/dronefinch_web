<template>
    <div class="flex justify-between items-center">
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
// 向前+x，向后-x，向左-y，向右+y，
const arrowList = [
  {value:'+x',class:'up'},
  {value:'-x',class:'down'},
  {value:'-y',class:'left'},
  {value:'+y',class:'right'},
];
  
// 云台方向控制
const onControl = (...params) => {
  emit('onControl',params);
};
  
  
  
  
</script>
  <style lang="scss" scoped>
  @import './drone-control-x.scss'
  
  
  
  </style>
  