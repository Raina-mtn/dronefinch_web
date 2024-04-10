<template>
    <div class="item mb-4">
      <div class="item-top flex justify-between items-center px-4">
        <div class="item-top--title text-xl font-medium">{{item.dataName}}</div>
        <div class="item-top--button flex items-center">
          <el-button @click="onJumpLiveDetail" type="primary" size="large" >实时监测</el-button>
          <el-button @click="onJumpLiveDetailOperation" type="primary" size="large" >远程控制</el-button>
          <el-button @click="openWarningDialog" type="danger" :class="[{'danger-inactive':!item.alarmNum}]" size="large" >告警信息<span v-if="item.alarmNum">({{ item.alarmNum }})</span></el-button>
        </div>
      </div>
      <section class="grid grid-cols-2 px-4 py-5 gap-4">
        <!-- 机场 -->
        <DeviceDetailItem :detail="item" type="1"/>
        <!-- 无人机 -->
        <DeviceDetailItem :detail="item.children[0]" type="2" />
      </section>
    </div>
  </template>
<script setup lang="ts">
import {ref, reactive} from "vue";
import {useRouter} from "vue-router";
  
import DeviceDetailItem from "../device-detail-item/device-detail-item.vue";
  
  interface Props {
    item:{ [key: string]: any}
  }
  
const router = useRouter();
const emit = defineEmits(["openWaring"]);
const props = withDefaults(defineProps<Props>(), {
  item: () => ({children:[]}),
});
  
//跳转实时监测 
const onJumpLiveDetail = () => {
  router.push({path:`/home/monitoring/detail/${props.item.id}`});
};
  // 跳转远程控制
const onJumpLiveDetailOperation = () => {
  router.push({path:`/home/monitoring/detail/${props.item.id}`, query:{type:"control"}});
};
  // 告警信息
const openWarningDialog = () => {
  emit("openWaring", props.item);
};
  
  
  
  
</script>
  <style lang="scss" scoped>
  @import './real-time-monitoring-item.scss'
  
  
  
  </style>
  