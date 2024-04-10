<template>
  <div class="bg-[#0B2363] p-14px  h-[calc(100%_-_48px)]">
    <ProTable
      ref="proTableRef" 
      :columns="tableColums" 
      max-height="680" 
      :initParam="initParam" 
      :request-api="(params) => getList(params)"
      :searchToolButton="false"
      >
        <!-- 表格操作 -->
        <template #operation="{ row }">
          <el-button v-for="item in taskStatus[row.taskStatus].operation" :key="item.label" link class="!text-[#0AF0FD]" @click="btns[item].function(row)"><i :class="['iconfont','mr-4px',btns[item].icon]"/> 
            {{ btns[item].label }}
          </el-button>
        </template>
      </ProTable>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, onBeforeUnmount} from "vue";
import { useRouter, useRoute } from "vue-router";

import { get, stop, download} from "@/api/interface/patrol/record";
import {columns} from "./config";
import {taskStatus} from "@/utils/enum/taskRecordEnum";
import {useDownload} from "@/hooks/useDownload";

import ProTable from "@/components/ProTable/index.vue";



const proTableRef = ref();
const initParam = reactive({}); // 参数
const timer = ref();
const router = useRouter();
const route = useRoute();
const taskName = ref(route.query.taskName || null);
const tableColums = computed(() => columns(taskName.value as string));
// 获取列表
const getList = (params) => {
  let startDay, endDay;
  params.startTime && (startDay = params.startTime[0]);
  params.startTime && (endDay = params.startTime[1]);
  const data = {
    "page.pageIndex":params.page.pageIndex,
    "page.pageSize":params.page.pageSize,
    startDay,
    endDay,
    ...params,
  };
  delete data.page;
  delete data.startTime;
  return get(data);
};
// 刷新
const refresh = () => {
  proTableRef.value.getTableList();
};

// 结束作业
const taskStop = async ({id}) => {
  try {
    await stop(id);
    refresh();
  } catch (error) {
    console.log("error :>> ", error);
  }
};

// 作业报告
const downLoad = async ({id}) => {
  try {
    // TODO: 暂缓
    // download(id);
    // await useDownload(download,id);
  } catch (error) {
    console.log("error :>> ", error);
  }
};


const btns = {
  audit:{
    label:"检测复核",
    icon:"icon-jiance1",
    function:(({id}) => {
      router.push({ path: "/home/patrol-manage/audit", query: { id, type:"audit" }});
    }),
  },
  // 下载
  report:{
    label:"作业报告",
    icon:"icon-xiangqing",
    function:downLoad,
  },
  // 复核页面-不能编辑
  result:{
    label:"作业结果",
    icon:"icon-jieguo",
    function:(({id}) => {
      router.push({ path: "/home/patrol-manage/audit", query: { id, type:"result" }});
    }),
  },
  // 作业回放-跳转
  back:{
    label:"作业回放",
    icon:"icon-bofang",
    function:(({airportId}) => {
      router.push({ path: `/home/monitoring/detail/${airportId}`, query:{preview:"1"}});
    }),
  },
  // 实时监测-跳转
  monitor:{
    label:"实时监测",
    icon:"icon-kanban",
    function:(({airportId}) => {
      router.push({ path: `/home/monitoring/detail/${airportId}`});
    }),
  },
  // 接口
  finish:{
    label:"结束作业",
    icon:"icon-jieshu1",
    function:taskStop,
  },
};//按钮

onMounted(() => {
  timer.value = setInterval(() => {
    refresh();
  }, 10 * 1000);
});
onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style scoped>

</style>