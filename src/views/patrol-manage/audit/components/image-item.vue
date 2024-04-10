<template>
  <div :class="['w-352px','h-324px','rounded-4px','m-5px','box-border']" style="box-sizing:border-box">
    <div class="w-full h-220px">
      <el-image class="w-full h-full" :src="img.imageUrl" fit="fill" />
    </div>
    <div class="bg-[#193580] h-100px p-16px text-white flex flex-wrap content-around">
      <div class="w-full">
        <span class="text-18px font-bold">{{ img.partsName }}</span>
        <el-tag v-if="img.detectStatusName" color="rgba(255, 144, 110, 0.60)" class="mx-5px !text-white border-[#FF906E]" size="small">{{ img.detectStatusName }}</el-tag>
        <el-tag v-if="img.detectResultName" color="rgba(71, 244, 191, 0.60)" class="mr-5px !text-white border-[#47F4BF]" size="small">{{ img.detectResultName }}</el-tag>
        <el-tag v-if="img.reviewStatusName" color="rgba(3, 199, 255, 0.60)" class="!text-white border-[#03C7FF]" size="small">{{ img.reviewStatusName }}</el-tag>
      </div>
      <div class="w-full">
        {{ img.partsName }}-{{ img.wayName }}-{{ img.towerName }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Image} from "../interface";
interface Props{
  img:Image
}
defineProps<Props>();
</script>

<style scoped>

</style>