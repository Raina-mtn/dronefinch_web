<template>
  <div class="p-16px">
    <info :currenCheck="currenCheck"></info>
    <!-- 缺陷信息 -->
    <div class="my-16px">
      <div class="before:content-DEFAULT before:rounded-4px before:inline-block before:w-4px before:h-20px before:bg-[#0AF0FD] before:mr-10px text-white text-16px flex items-center pb-16px">
        缺陷信息
      </div>
      <el-scrollbar max-height="400px">
        <defectInfo v-for="(item,index) in currenCheck.infoList" :index="index" :key="item.id" :item="item" class="mb-16px"></defectInfo>
      </el-scrollbar>
    </div>

    <!-- 备注信息 -->
    <div class="my-16px">
      <div class="before:content-DEFAULT before:rounded-4px before:inline-block before:w-4px before:h-20px before:bg-[#0AF0FD] before:mr-10px text-white text-16px flex items-center pb-16px">
        备注信息
      </div>
      <el-scrollbar max-height="250px">
        <noteInfo v-for="(item,index) in currenCheck.reviewCommentList" :index="index" :key="item.commentPoint" :item="item" class="mb-16px"></noteInfo>
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
}
defineProps<Props>();

</script>

<style scoped>

</style>