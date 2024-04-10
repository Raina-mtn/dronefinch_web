<template>
  <div class="w-full h-full flex justify-between">
    <div class="w-[20%] h-full bg-[#0B2363]">
      <leftPanel :imageList="imageList" :currenCheck="currenCheck" @setCurrentCheck="setCurrentCheck" @getList="getList"></leftPanel>
    </div>
    <div class="w-[60%] h-full bg-[#0B2363] mx-16px">
      <mainPanel ref="mainPanelRef" :isAudit="initParams.type === 'audit'" :currenCheck="currenCheck" :currentIsFirst="currentIndex === 0" :currentIsLast="currentIndex === imageList.length - 1" @btnPre="btnPre" @btnNext="btnNext" @createInfo="createInfo" @changePosition="changePosition" @submit="submit"></mainPanel>
    </div>
    <div class="w-[20%] h-full bg-[#0B2363]">
      <rightPanel :isAudit="initParams.type === 'audit'" :currenCheck="currenCheck"></rightPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, getCurrentInstance, onUnmounted} from "vue";
import {Image, CurrenCheck} from "./interface";
import {getImageList, getImageDetail, getImageSubmit} from "@/api/interface/patrol/audit";
import { ElMessage, ElMessageBox } from "element-plus";

import leftPanel from "./components/left-panel/index.vue";
import mainPanel from "./components/main-panel.vue";
import rightPanel from "./components/right-panel/index.vue";

import { useRoute } from "vue-router";
const route = useRoute();

// 在setup函数中获取实例对象并定义bus
const instance = getCurrentInstance();
const bus = instance?.appContext.config.globalProperties.$bus;
const initParams = computed(() => route.query || {});

// 图片列表
let imageList = ref<Image[]>([] as Image[]);

// 当前选中图片
const currenCheck = ref<CurrenCheck>({} as CurrenCheck);
const currentIndex = computed(() => {
  return imageList.value.findIndex(item => item.id === currenCheck.value?.id);
});
const mainPanelRef = ref();

// 选中
const setCurrentCheck = async (item) => {
  const params = {
    jobId:initParams.value.id,
    id:item.id,
  };
  const list = (await getImageDetail(params)).data;
  list.infoList.map((i, index) => i.num = index + 1);//排序
  list.reviewCommentList.map((i, index) => i.num = index + 1);//排序
  currenCheck.value = list;
};

//图片切换
const btnPre = () => {
  if (currentIndex.value === 0) return;
  currenCheck.value = imageList[currentIndex.value - 1];
};
const btnNext = () => {
  if (currentIndex.value === imageList.value.length - 1) return;
  currenCheck.value = imageList[currentIndex.value + 1];
};

// 请求图片
const getList = async (params = {}) => {
  imageList.value = (await getImageList({...initParams.value, ...params})).data;
};
// 删除
const deleteInfo = (target, index, type, id) => {
  ElMessageBox.confirm(
    "确认删除?",
    "提示",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(() => {
      target.splice(index, 1);
      mainPanelRef.value.deleteGraphics(type, id);
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
    });
};
// 修改信息||删除信息
const changeInfo = async ({type, operate, newInfo}) => {
  if (type === "defect"){
    const index = currenCheck.value.infoList.findIndex(i => i.num === newInfo.num);
    if (operate === "update"){
      // 更新
      currenCheck.value.infoList[index] = newInfo;
    } else {
      deleteInfo(currenCheck.value.infoList, index, "defete", newInfo.num);
    }
  } else {
    const index = currenCheck.value.reviewCommentList.findIndex(i => i.num === newInfo.num);
    if (operate === "update"){
      // 更新
      currenCheck.value.reviewCommentList[index] = newInfo;
    } else {
      deleteInfo(currenCheck.value.reviewCommentList, index, "note", newInfo.num);
    }
  }
};

// 修改标注
const changePosition = ({id, newPosition}) => {
  const index = currenCheck.value.infoList.findIndex(i => i.id === id);
  currenCheck.value.infoList[index].defectShape = JSON.stringify(newPosition);
};
// 新增缺陷||新增备注
const createInfo = ({type, data, index}) => {
  if (type === "RECT" || type === "POLYGON"){
    // 矩形||多边形
    currenCheck.value.infoList.push({num:index, defectShape:JSON.stringify(data), shapeType:type});
  } else {
    //备注
    currenCheck.value.reviewCommentList.push({num:index, commentPoint:JSON.stringify(data)});
  }
};
// 完成审核
const submit = async () => {
  try {
    await getImageSubmit(currenCheck.value);
    await getList();
    setCurrentCheck(imageList.value[0]);
  } catch (error) {
    console.log("error :>> ", error);
  }
};

onMounted(async () => {
  await getList();
  setCurrentCheck(imageList.value[0]);
  bus.on("changeInfo", changeInfo);
  bus.on("getList", getList);
});
onUnmounted(() => {
  bus.off("changeInfo", changeInfo);
  bus.off("getList", getList);
});
</script>

<style scoped>

</style>