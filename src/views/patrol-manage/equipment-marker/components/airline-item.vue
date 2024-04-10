<template>
  <div :class="['flex-center','w-full','h-90px','p-16px','cursor-pointer',item.id===checkId?'bg-[#095CBD]':'']">
    <div class="flex-grow">
      <span class="text-16px font-bold mr-12px">{{ item.actionCode }}</span>
      <el-tag v-if="item.project" class="text-white" :style="{'background-color':projectStatus[item.project].color,'border-color':projectStatus[item.project].border}">{{ projectStatus[item.project].label }}</el-tag>
      <div class="text-[#FFFFFFCC] mt-14px">{{ item.partsName }}-{{ item.lineName }}-{{ item.towerName }}</div>
    </div>
    <el-icon size="16"><ArrowRight /></el-icon>
  </div>
</template>

<script setup lang="ts">
import {projectStatus} from "@/utils/enum/airLineManageEnum";
interface Props{
  item:any
  checkId?:number
}
defineProps<Props>();
defineEmits(["setCurrentCheck"]);
</script>

<style scoped>

</style>