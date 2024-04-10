<template>
    <div class="h-full flex flex-col text-white">
      <SearchHeader @onSearch="onSearch" class="flex-shrink-0"/>
      <el-scrollbar class="h-full flex-1">
        <section class="mx-6 mb-4"  
          v-infinite-scroll="loadList" 
          :infinite-scroll-disabled="pageParams.isEnd || pageParams.loading"
        >
          <RealTimeMonitoringItem 
              v-for="item in list"
              :key="item.id"
              :item="item"
              @openWaring="openWaringDialog"
          />
        </section>
      </el-scrollbar>
      <WarningDialog ref="warningDialogRef"/>
    </div>
  </template>
<script setup lang="ts">
import {ref, reactive, getCurrentInstance, toRefs, onBeforeMount} from "vue";
import * as  realTimeApi from "@/api/interface/monitoring/real-time";
import * as  monitorApi from "@/api/interface/monitoring/monitor";
  
import SearchHeader  from "./components/search-header/search-header.vue";
// import RealTimeMonitoringItem  from "./components/real-time-monitoring-item/real-time-monitoring-item.vue";
import RealTimeMonitoringItem from "./components/real-time-monitoring-item/real-time-monitoring-item.vue";
import WarningDialog  from "./components/warning-dialog/warning-dialog.vue";
  
// 获取app的全局属性
const app = getCurrentInstance()?.appContext.config.globalProperties;
  
const state = reactive({
  pageParams:{
    loading:false,
    pageNo:1,
    pageSize:10,
    isEnd:false,
  }, //分页参数
  list:[] as any[],
});
let {pageParams, list} = toRefs(state);
const warningDialogRef = ref();
let videoList:{[key:string]:any}[] = [];
  
onBeforeMount(() => {
  getVideoList();
});
  
// 搜索
const onSearch = (data = {}) => {
  pageParams.value = {
    loading:false,
    pageNo:1,
    pageSize:10,
    isEnd:false,
    ...data,
  };
  loadList();
};
  // 加载list数据
const loadList = async () => {
  if (pageParams.value.loading) return;
  const params = {
    ...pageParams.value,
  };
  // console.log("pageParams======>", pageParams.value.loading);
  pageParams.value.loading = true;
  try {
    const {data} = await realTimeApi.getRealTimeMonitoringList(params);
    const arr = pageParams.value.pageNo === 1 ? data : list.value.push(...data);
    list.value = handleAirportAndDroneSort(arr);
    pageParams.value.pageNo += 1;
    if (pageParams.value.pageSize > list.value.length){
      pageParams.value.isEnd = true;
    }
  } catch (error) {
    console.log("error======>", error);
  } finally {
    pageParams.value.loading = false;
    // 目前没有分页 功能先留着 所以直接end了 后续可以删掉
    pageParams.value.isEnd = true;
  }
};
  
// 打开告警弹窗
const openWaringDialog = (row) => {
  warningDialogRef.value.openDialog(row);
};

// 获取视频list
const getVideoList = async () => {
  const params = {
    deviceSnList:[],
  };
  const {data} = await monitorApi.getDroneCameraInfo(params);
  videoList = data;
};

// 处理视频数据根据deviceSn给每一个机场和无人机添加视频数据 视频可以是多个
const handleAirportAndDroneSort = (listData) => {
  let mergeData = [];
  const videoObject = videoList.reduce((acc, videoItem) => {
    if (acc[videoItem.deviceSn]){
      acc[videoItem.deviceSn].push(videoItem);
    } else {
      acc[videoItem.deviceSn] = [videoItem];
    }
    return acc;
  }, {});
  mergeData = listData.map(i => {
    if (videoObject[i.deviceSn]){
      i.videoList = videoObject[i.deviceSn];
    }
    const drone = i.children[0] || {};
    if (videoObject[drone.deviceSn]){
      drone.videoList  = videoObject[drone.deviceSn];
    }
    return i;
  });
  return mergeData;
};

  
  
</script>

<style lang="scss" scoped>
@import './real-time-monitoring.scss'



</style>
  