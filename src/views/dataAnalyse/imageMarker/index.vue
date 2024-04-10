<template>
  <div class="w-full h-full flex justify-between">
    <div class="w-[80%] h-full bg-[#0B2363] mx-16px">
      <mainPanel ref="mainPanelRef" :currenCheck="currenCheck" ></mainPanel>
    </div>
    <div class="w-[20%] h-full bg-[#0B2363]">
      <rightPanel :currenCheck="currenCheck"></rightPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {CurrenCheck} from "./interface";
// import {apiGetImage} from '@/mock/patrol';
// import { ElMessage, ElMessageBox } from 'element-plus';
import mainPanel from "./components/main-panel.vue";
import rightPanel from "./components/right-panel/index.vue";
import { useRoute } from "vue-router";
import { getAlarmPicture } from "@/api/interface";

// 在setup函数中获取实例对象并定义bus
// const instance = getCurrentInstance();
// const bus = instance?.appContext.config.globalProperties.$bus;
const route = useRoute();
// 当前选中图片
const currenCheck = ref<CurrenCheck>({} as CurrenCheck);

const mainPanelRef = ref();


// 请求图片
const getList = async () => {
  const list = (await getAlarmPicture({id:route.query.id})).data;
  list.infoList.map((i, index) => i.num = index + 1);//排序
  list.reviewCommentList.map((i, index) => i.num = index + 1);//排序
  currenCheck.value = list;
  currenCheck.value = list;
};


onMounted(async () => {
  await getList();
});
</script>

<style scoped>

</style>