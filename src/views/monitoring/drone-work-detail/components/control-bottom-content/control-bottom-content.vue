<!--
 * @Author: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @Date: 2023-11-30 14:13:18
 * @LastEditors: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @LastEditTime: 2023-12-04 13:20:04
 * @FilePath: \dronefinch_web\src\views\monitoring\drone-work-detail\components\control-bottom-content\control-bottom-content.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex items-center">
    <!-- 最左侧按钮控制权 -->
    <section class="flex flex-col justify-center mr-6">
      <div v-for="item in controlTypeList" :key="item.value"
        :class="[{ active: item.value === controlType }, 'cursor-pointer flex items-center justify-center h-8 w-30.5 rounded mb-4 text-sm control-button']"
        @click="onChangeControlType(item.value)">
        {{ item.name }}
      </div>
    </section>
    <!-- 中间方向控制 -->
    <section class="flex items-center justify-center">
      <!-- z轴的旋转和上下操作板块 -->
      <DroneControlZ @onControl="onControlDrone" />
      <!-- 指南针 -->
      <DroneDirectionCard :angle="droneData.attitude_head" />
      <!-- x轴前后左右平移操作板块 -->
      <DroneControlX @onControl="onControlDrone" />
    </section>
    <!-- 最右侧其他操作按钮 -->
    <section class="flex flex-col justify-center ml-6">
      <div v-for="item in otherControlButtonList" :key="item.value"
        :class="[item.value === DroneControlPower.RETURN ? 'smart-return' : 'quick-stop', 'cursor-pointer flex items-center justify-center h-8 w-20 rounded mb-4 text-sm control-button']"
        @click="onControlOtherEvent(item.value)">
        {{ item.name }}
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onUnmounted, inject } from "vue";
import { DroneControlPower } from "@/enums/droneTask";
import DroneControlZ from "../drone-control-z/drone-control-z.vue";
import DroneControlX from "../drone-control-x/drone-control-x.vue";
import DroneDirectionCard from "../drone-direction-card/drone-direction-card.vue";

const emits = defineEmits(["onChangeControlType", "onMove"]);
let controlType = ref("");//控制权类型
let seq = 0;//消息发送顺序
const frequency = 2; // 每秒频次
let timer: any = null;//定时器
let startTime = 0;//开始时间

const droneData = inject("droneData", { attitude_head: 0});


const controlTypeList = [
  { name: "一键起飞", value: DroneControlPower.ONETOUCH },
  { name: "抢夺飞行控制权", value: DroneControlPower.FLY },
  { name: "抢夺负载控制权", value: DroneControlPower.LOAD },
];
const otherControlButtonList = [
  { name: "智能返航", value: DroneControlPower.RETURN },
  { name: "急停", value: DroneControlPower.STOP },
];

onUnmounted(() => {
  clearTimer();
});

// 控制权选择
const onChangeControlType = (val) => {
  controlType.value = val;
  emits("onChangeControlType", val);
};

// 无人机其他控制
const onControlOtherEvent = (val) => {
  emits("onChangeControlType", val);
};

// 操作无人机上下旋转操作 左右前后平操作
// 向前+x，向后-x，向左-y，向右+y，向上+h，向下-h，左转-w，右转+w
const onControlDrone = ([type, value]) => {
  switch (type) {
  case "start":
    // 鼠标按下开始
    startTime = new Date().getTime();
    sendMessage(value);
    break;
  case "stop":
    // 鼠标松开结束
    seq = 0;
    // 点击也触发一次
    if (new Date().getTime() - startTime < 200) {
      emits("onMove", {
        "seq": seq, "direction": value,
      });
    }
    clearTimer();
    break;
  default:
    break;
  }
  console.log(type, value);
};

// 发送无人机操作消息给ws
const sendMessage = (value) => {
  timer = setInterval(() => {
    // 超过五秒做限制不执行
    if (new Date().getTime() - startTime > 5000) {
      clearTimer();
      return;
    }
    emits("onMove", {
      "seq": seq, "direction": value,
    });
    // 频次每秒2次 seq是发送顺序0-1
    if (seq > (frequency - 2)) {
      console.log(new Date());
      seq = 0;
    } else {
      seq++;
    }
  }, 1000 / frequency);
};

// 清除定时器
const clearTimer = () => {
  clearInterval(timer);
  timer = null;
};

</script>
<style lang="scss" scoped>
@import './control-bottom-content.scss'
</style>
