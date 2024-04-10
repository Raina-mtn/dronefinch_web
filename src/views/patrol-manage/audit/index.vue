<template>
  <div>
    <div class="h-145px bg-[#0B2363] px-24px py-20px">
      <el-descriptions title="220KVxx线日常巡检">
        <el-descriptions-item label="任务编号：">{{ recordInfo.taskCode }}</el-descriptions-item>
        <el-descriptions-item label="任务类型：">{{ recordInfo.taskTypeName }}</el-descriptions-item>
        <el-descriptions-item label="执行机库：">{{ recordInfo.airportName }}</el-descriptions-item>
        <el-descriptions-item label="任务状态：">
          <el-tag size="small" :color="taskStatus[recordInfo.taskStatus]?.color??'#03C7FF'" :style="{'border-color':taskStatus[recordInfo.taskStatus]?.color??'#03C7FF'}" class="text-white">{{ recordInfo.taskStatusName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="责任人：">{{ recordInfo.responsibleBy }}</el-descriptions-item>
        <el-descriptions-item label="巡检时间：">{{ recordInfo.startTime }} - {{ recordInfo.endTime }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <el-tabs
      v-model="activeName"
      class="my-16px"
      type="card"
      @tab-click="handleClick"
    >
    <el-tab-pane v-for="item in recordInfo.detectTypeList" :key="item.code" :label="`${item.name}(${item.num})`" :name="item.code">
      <tabItem :code="item.code" :recordInfo="recordInfo" :type="type"></tabItem>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from "vue";
import {get} from "@/api/interface/patrol/audit";
import {taskStatus} from "@/utils/enum/taskRecordEnum";
import {RecordInfo} from "./interface";

import tabItem from "./components/tab-item.vue";

import { useRoute } from "vue-router";
const route = useRoute();


const activeName = ref();
const recordInfo = ref<RecordInfo>({} as RecordInfo);

const recordId = computed(() => route.query.id || "");
const type = computed(() => route.query.type || "");

const handleClick = () => {};
const getInfo = async () => {
  try {
    recordInfo.value = (await get(recordId.value)).data;
    activeName.value = recordInfo.value.detectTypeList[0].code;
  } catch (error) {
    console.log("error :>> ", error);
  }
};

onMounted(async () => {
  getInfo();
});
</script>

<style scoped>

</style>