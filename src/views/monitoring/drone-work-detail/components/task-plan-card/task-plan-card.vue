<template>
    <el-scrollbar class="timeline-box h-full">
        <div  v-infinite-scroll="loadList" :infinite-scroll-disabled="pageParams.isEnd || pageParams.loading">
            <div class="plan-item mb-4" v-for="(item,index) in list" :key="index">
                <div class="flex justify-between items-center text-base mb-1">
                    <span>{{ item.taskName }}</span>
                    <span :class="['rounded text-xs tag flex items-center justify-center px-2 h-5',item.status === PlanComplyType.REGULAR?'regular':'circle']">{{ item.executeTypeName}}</span>
                </div>
                <div class="flex justify-between items-center text-xs text-white text-opacity-85">
                    <span>{{ item.lineName  }}</span>
                    <span>{{ item.taskTime }}</span>
                </div>
            </div>
        </div>
    </el-scrollbar>
</template>
<script setup lang="ts">
import {ref, reactive, onBeforeMount, toRefs} from "vue";

import {PlanComplyType} from "@/enums/droneTask";
import * as taskPlanApi from "@/api/interface/task-plan/task-plan";

const state = reactive({
  list:[] as {[key: string]: any}[],
  pageParams:{
    loading:false,
    pageNo:1,
    pageSize:10,
    isEnd:false,
  }, //分页参数
});

let {list, pageParams} = toRefs(state);
onBeforeMount(() => {
  loadList();
});

const loadList = async () => {
  //   return;
  if (pageParams.value.loading) return;
  const params = {
    "page.pageIndex":pageParams.value.pageNo,
    "page.pageSize":pageParams.value.pageSize,
  };
  // console.log("pageParams======>", pageParams.value.loading);
  pageParams.value.loading = true;
  try {
    const {data:{list:arr}} = await taskPlanApi.getMonitorTaskPlan(params);
    list.value = pageParams.value.pageNo === 1 ? arr : list.value.push(...arr);
    pageParams.value.pageNo += 1;
    if (pageParams.value.pageSize > list.value.length){
      pageParams.value.isEnd = true;
    }
  } catch (error) {
    console.log("error======>", error);
  } finally {
    pageParams.value.loading = false;
  }
};


</script>
<style lang="scss" scoped>
@import './task-plan-card.scss'



</style>
