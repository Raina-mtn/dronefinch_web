<template>
    <div class="flex justify-between items-center relative  mr-10">
      <div class="control-box w-35 h-35 " :style="{transform:`rotate(${90-angle}deg)`}">
      </div> 
      <img class="pointer absolute w-13 h-17.75" src="@images/compass-arraw.png" alt="">
    </div>
  </template>
<script setup lang="ts"> 
import {ref, reactive} from "vue";
const props =  defineProps(["angle"]);
  
  
  
  
  
</script>
  <style lang="scss" scoped>
  @import './drone-direction-card.scss'
  
  
  
  </style>
  