<template>
  <div class="bg-[#193580] w-full h-95px p-16px flex rounded-4px">
    <div v-if="currenCheck?.partsId" class="flexwrap justify-between">
      <div class="w-full">
        <span class="text-18px font-bold text-white">{{ currenCheck?.partsName??'' }}</span>
        
        <el-tag v-if="currenCheck.detectStatusName" color="rgba(255, 144, 110, 0.60)" class="mx-5px !text-white border-[#FF906E]" size="small">{{ currenCheck.detectStatusName }}</el-tag>
        <el-tag v-if="currenCheck.detectResultName" color="rgba(71, 244, 191, 0.60)" class="mr-5px !text-white border-[#47F4BF]" size="small">{{ currenCheck.detectResultName }}</el-tag>
        <el-tag v-if="currenCheck.reviewStatusName" color="rgba(3, 199, 255, 0.60)" class="!text-white border-[#03C7FF]" size="small">{{ currenCheck.reviewStatusName }}</el-tag>
      </div>
      <div class="text-[#FFFFFFCC] w-full">
        {{ currenCheck.partsName }}-{{ currenCheck.wayName }}-{{ currenCheck.towerName }}
      </div>
    </div>
    <div v-else class="flexwrap justify-betwee">
      <div class="w-full">
        <span class="text-18px font-bold text-white">无绑定设备</span>
        <el-tag v-if="currenCheck.detectStatusName" color="rgba(255, 144, 110, 0.60)" class="mx-5px !text-white border-[#FF906E]" size="small">{{ currenCheck.detectStatusName }}</el-tag>
        <el-tag v-if="currenCheck.detectResultName" color="rgba(71, 244, 191, 0.60)" class="mr-5px !text-white border-[#47F4BF]" size="small">{{ currenCheck.detectResultName }}</el-tag>
        <el-tag v-if="currenCheck.reviewStatusName" color="rgba(3, 199, 255, 0.60)" class="!text-white border-[#03C7FF]" size="small">{{ currenCheck.reviewStatusName }}</el-tag>
      </div>
      <div>
        <el-link :underline="false" class="text-[#0AF0FD]" @click="bindDialogRef.openDialog()">立即绑定</el-link>
      </div>
    </div>
    <bindDialog ref="bindDialogRef" :currenCheck="currenCheck"></bindDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import bindDialog from "./bind-dialog.vue";
import {CurrenCheck} from "../../../interface";
interface Props{
  currenCheck:CurrenCheck
}
defineProps<Props>();

const bindDialogRef = ref();
</script>

<style scoped>

</style>