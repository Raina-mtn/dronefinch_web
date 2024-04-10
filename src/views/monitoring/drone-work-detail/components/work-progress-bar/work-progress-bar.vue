<template>
    <div class="progress-bar">
        <div>
          <el-slider v-model="progress" :format-tooltip="formatTooltip" @change="slideChange" @input="slideInput"/>
        </div>
        <div class="flex items-center justify-between ">
          <span>{{ startTime }}</span>
          <span>{{ endTime }}</span>
        </div>
    </div>
  </template>
<script setup lang="ts">
import {ref, reactive, computed, getCurrentInstance, onMounted, onUnmounted} from "vue";
import moment from "moment";
  
// 在setup函数中获取实例对象并定义bus
const instance = getCurrentInstance();
const bus = instance?.appContext.config.globalProperties.$bus;
  
const props = defineProps(["timeRange"]);
const progress = ref(0);
const stopUpdate = ref(false);//拖动过程禁止更新滑块进度
  
// 开始时间 
const startTime = computed(() => {
  if (!props?.timeRange[0]) return "";
  return moment(props.timeRange[0]).format("MM-DD HH:mm");
});
  // 结束时间
const endTime = computed(() => {
  if (!props?.timeRange[1]) return "";
  return moment(props.timeRange[1]).format("MM-DD HH:mm");
});
  
// 计算时间差s为单位
const start = moment(props.timeRange[0], "YYYY-MM-DD HH:mm:ss");
const end = moment(props.timeRange[1], "YYYY-MM-DD HH:mm:ss");
const diffSeconds = end.diff(start, "seconds");
  
// 滑块的进度格式成时间
const formatTooltip = (val:number) => {
  const progress = diffSeconds / 100 * val;
  return moment(start).add(progress, "seconds").format("MM-DD HH:mm");
};
  
onMounted(() => {
  bus.on("videoPlaying", changeProgress);
});
  
onUnmounted(() => {
  bus.off("videoPlaying", changeProgress);
});
  
// 滑块拖动事件 松手 更改video进度
const slideChange = (val) => {
  stopUpdate.value = false;
  const seconds = diffSeconds / 100 * val;
  const fullTime = start.add(seconds, "seconds").format("YYYY-MM-DD HH:mm");
  bus.emit("updateCurrentTime", {seconds, time:fullTime});
};
  
// 滑块拖动时进度 控制不让video更新滑块进度
const slideInput = () => {
  stopUpdate.value = true;
};
  
// video进度改变 更新滑块进度
const changeProgress = ({time}) => {
  if (stopUpdate.value) return;
  progress.value = Math.ceil((time / diffSeconds) * 100);
};
  
  
</script>

<style lang="scss" scoped>
@import './work-progress-bar.scss'


</style>
  