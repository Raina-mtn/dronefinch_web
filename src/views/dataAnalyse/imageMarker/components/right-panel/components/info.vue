<template>
  <div class="bg-[#193580] w-full h-95px p-16px flex rounded-4px">
    <div class="flexwrap justify-between">
      <div class="w-full">
        <span class="text-18px font-bold text-white">{{ currenCheck?.partsName??'' }}</span>
        
        <el-tag v-if="currenCheck.detectStatusName" color="rgba(255, 144, 110, 0.60)" class="mx-5px !text-white border-[#FF906E]" size="small">{{ currenCheck.detectStatusName }}</el-tag>
        <el-tag v-if="currenCheck.detectResultName" color="rgba(71, 244, 191, 0.60)" class="mx-5px !text-white border-[#47F4BF]" size="small">{{ currenCheck.detectResultName }}</el-tag>
        <el-tag v-if="currenCheck.reviewStatusName" color="rgba(3, 199, 255, 0.60)" class="mx-5px !text-white border-[#03C7FF]" size="small">{{ currenCheck.reviewStatusName }}</el-tag>
      </div>
      <div class="text-[#FFFFFFCC] w-full">
        {{ currenCheck.partsName }}-{{ currenCheck.wayName }}-{{ currenCheck.towerName }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {CurrenCheck} from "../../../interface";
interface Props{
  currenCheck:CurrenCheck
}
defineProps<Props>();
</script>

<style scoped>

</style>