<template>
  <div class="p-16px">
    <info :currenCheck="currenCheck"></info>
    <!-- 缺陷信息 -->
    <div class="my-16px">
      <div class="before:content-DEFAULT before:rounded-4px before:inline-block before:w-4px before:h-20px before:bg-[#0AF0FD] before:mr-10px text-white text-16px flex items-center pb-16px">
        缺陷信息
      </div>
      <el-scrollbar max-height="350px" class="h-350px">
        <defectInfo :isAudit="isAudit" v-for="item in currenCheck.infoList" :key="item.num" :item="item" class="mb-16px"></defectInfo>
        <div v-if="!currenCheck.infoList || !currenCheck.infoList.length" class="text-white text-center">暂无数据</div>
      </el-scrollbar>
    </div>

    <!-- 备注信息 -->
    <div class="my-16px">
      <div class="before:content-DEFAULT before:rounded-4px before:inline-block before:w-4px before:h-20px before:bg-[#0AF0FD] before:mr-10px text-white text-16px flex items-center pb-16px">
        备注信息
      </div>
      <el-scrollbar max-height="300px" class="h-300px">
        <noteInfo :isAudit="isAudit" v-for="item in currenCheck.reviewCommentList" :key="item.num" :item="item" class="mb-16px"></noteInfo>
      <div v-if="!currenCheck.reviewCommentList|| !currenCheck.reviewCommentList.length" class="text-white text-center">暂无数据</div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts" name="rightPanel">
import {CurrenCheck} from "../../interface";

import info from "./components/info.vue";
import defectInfo from "./components/defect-info.vue";
import noteInfo from "./components/note-info.vue";

interface Props{
  currenCheck:CurrenCheck
  isAudit:boolean
}
defineProps<Props>();

</script>

<style scoped>

</style>