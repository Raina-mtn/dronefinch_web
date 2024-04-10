<template>
  <div class="w-full h-full relative layout-container text-white ">
    <!-- 地图 -->
    <div class="map-scale-container w-100vw h-100vh">
      <DroneCesiumMap ref="cesuimMap" v-if="true" :isPreview="isPreview" :positions="workTopData.point_list"  />
    </div>
    <!-- 左侧数据栏 -->
    <section class="absolute inset-y-7 left-8  w-100 overflow-hidden">
      <!-- 气象信息 -->
      <WorkDataContainer title="气象信息">
        <template #content>
          <div class="grid grid-cols-2 w-full gap-y-6 my-9.5 mx-6">
            <DataInfoCard :list="weatherStaticData" :data='weatherData'/>
          </div>
        </template>
      </WorkDataContainer>
      <!-- 机场状态 -->
      <WorkDataContainer title="机场状态">
        <template #content>
          <div class="content-header flex items-center m-6 mb-0">
            <img class="flex-shrink-0 w-15 h-15 ml-2 mr-3" :src="imagesMap['airport-avatar']" />
            <div class="">
              <div class="flex">
                <span class="text-base mr-2">{{ airportDetail.dataName }}</span>
                <span
                  class="flex items-center justify-center text-xs px-2 !bg-primary !bg-opacity-20 rounded border-primary !text-primary border-solid border">{{
                    airportData.air_port_mode }}</span>
              </div>
              <div class="flex items-center text-xs mt-4px">
                <span class="mr-6">覆盖线路：{{ airportDetail.coverLineName }}</span>
                <span>SN：{{ airportDetail.airportSn }}</span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 w-full gap-y-2.5 relative p-6">
            <DataInfoCard :list="airportStaticData" :data='airportData'/>
          </div>
        </template>
      </WorkDataContainer>
      <!-- 飞行器状态 -->
      <WorkDataContainer title="飞行器状态">
        <template #content>
          <div class="content-header flex items-center  m-6 mb-0">
            <img class="flex-shrink-0 w-15 h-15 ml-2 mr-3" :src="imagesMap['drone-avatar']" />
            <div class="">
              <div class="flex">
                <span class="text-base mr-2">{{ droneDetail.dataName }}</span>
                <span
                  class="flex items-center justify-center text-xs px-2 !bg-primary !bg-opacity-20 rounded border-primary !text-primary border-solid border ">{{
                    droneData.drone_mode }}</span>
              </div>
              <div class="flex items-center text-xs mt-4px">
                <span>SN：{{ droneDetail.deviceSn }}</span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 w-full gap-y-2.5 relative p-6">
            <DataInfoCard :list="droneStaticData" :data='droneData' />
            <!-- 设备离线显示 -->
            <div v-show="droneData.drone_alive === DRONEALIVE.NO"
              class="flex flex-col items-center justify-center absolute w-full h-full overlay-offline z-10 inset-0">
              <img src="@images/warning.png" class="w-6 h-6 mb-2" alt="">
              <div class="text-base mb-1">请检查设备情况</div>
              <div class="text-sm">设备未在线</div>
            </div>
          </div>
        </template>
      </WorkDataContainer>
    </section>
    <!-- 中间顶部数据：|| isControl === IsControlDrone.YES 后端说控制时候顶部数据先不要 -->
    <section v-if="droneStatus === DroneStatusEnum.WORK && isControl === IsControlDrone.NO" class="flex items-center justify-around work-header h-20 px-8.5 z-10 top-10 absolute">
      <div class="flex items-center mr-7.5" :key="item.name" v-for="item in headData">
        <div class="relative w-11.5 h-11.5">
          <el-progress class="circle-progress" :width="46" :stroke-width="2" type="circle" :percentage="item.progress"
            color="rgba(10, 240, 253, 1)" :show-text="false" />
          <img :src="item.icon" class="w-7 h-7 absolute icon-image" />
        </div>
        <div class="ml-3">
          <div class="text-base">{{ item.name }}</div>
          <div class="!text-primary text-6.5">{{ item.value }}</div>
        </div>
      </div>
    </section>
   
    <!-- 右侧数据栏 -->
    <section class="absolute inset-y-7 right-8  w-100 overflow-hidden flex flex-col">
      <!-- 飞行器实时画面 -->
      <WorkDataContainer v-if="droneStatus === DroneStatusEnum.WORK" title="飞行器实时画面" class="flex-shrink-0">
        <template #titleRight>
          <el-select v-model="droneVideoUrl" class="video-select" placeholder="">
            <el-option v-for="item in droneVideoList" :key="item.cameraId" :label="item.cameraName"
              :value="item.videoUrl" />
          </el-select>
        </template>
        <template #content>
          <RtmpVideo v-if="droneVideoUrl" :videoSrc="droneVideoUrl" :isPreview="isPreview" from="drone"
            class="mx-6 py-6 h-59.5" />
        </template>
      </WorkDataContainer>
      <!-- 云台控制 -->
      <WorkDataContainer v-if="isControl === IsControlDrone.YES" title="云台控制" class="flex-shrink-0">
        <template #titleRight>
          <el-dropdown class="ptz-reset-dropdown" @command="handleCameraCommand">
            <div class="el-dropdown-link flex items-center mr-2.5 cursor-pointer">
              <span>拍照模式</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="item.value" v-for="item in PTZControlList" :key="item.value">{{ item.name
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template #content>
          <!-- 云台控制内容 -->
          <PTZControlCard @onReset="handlePTZControlCommand" @onChangeZoom="onChangePTZZoom" @takePhoto="PTZTakePhoto" />
        </template>
      </WorkDataContainer>
      <!-- 机场实时画面 -->
      <WorkDataContainer title="机场实时画面" class="flex-shrink-0">
        <template #titleRight>
          <el-select v-model="airportVideoUrl" class="video-select" placeholder="">
            <el-option v-for="item in airportVideoList" :key="item.cameraId" :label="item.cameraName"
              :value="item.videoUrl" />
          </el-select>
        </template>
        <template #content>
          <RtmpVideo v-if="airportVideoUrl" :videoSrc="airportVideoUrl" class="mx-6 py-6 h-59.5" from="airport"
            :isPreview="isPreview" />
          <div v-else class="flex justify-center py-12.5 flex-col items-center">
            <img class="h-40 w-40" src="@images/no-video.png" alt="">
            <p class="text-sm text-opacity-85 text-white">暂无视频</p>
          </div>
        </template>
      </WorkDataContainer>
      <!-- 任务日志 -->
      <WorkDataContainer v-if="droneStatus === DroneStatusEnum.WORK && isControl === IsControlDrone.NO" title="任务日志"
        class="">
        <template #content>
          <TaskLogCard :list="workTopData.task_log_list || []" />
        </template>
      </WorkDataContainer>
      <!-- 任务计划 -->
      <WorkDataContainer v-if="droneStatus === DroneStatusEnum.NOWORK" title="任务计划" class="">
        <template #content>
          <TaskPlanCard class="px-6 pt-6" />
        </template>
      </WorkDataContainer>
    </section>
    <!-- 远程控制状态下 页面中间下方操作栏 -->
    <section v-if="isControl === IsControlDrone.YES" class="absolute z-10 bottom-8 control-bottom-box">
      <ControlBottomContent @onChangeControlType="onChangeControlType" @onMove="onDroneMove" />
    </section>
    <!-- 改变elementui的圆弧进度条颜色为渐变色 -->
    <svg width="0" height="100%">
      <defs>
        <linearGradient id="gradientColor" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgba(10, 240, 253, 1)" stop-opacity="1"></stop>
          <stop offset="100%" style="stop-color:rgba(66, 101, 255, 1)" stop-opacity="1"></stop>
        </linearGradient>
      </defs>
    </svg>

    <!-- 预览状态下 页面中间下方操作栏:因为autofit导致slidebar点击不准确，所以挪了出来 -->
    <section v-if="isPreview" class="absolute z-10  control-bottom-progress text-white">
      <WorkProgressBar :timeRange="previewRange" style='margin-left:-50%;'/>
    </section>
  </div>

</template>

<script setup lang="ts" name="DroneWorkDetail">
import { ref, reactive, onMounted, toRefs, computed, getCurrentInstance, watch, Ref, onUnmounted, provide } from "vue";
import { useRoute } from "vue-router";
import { useWebSocket } from "@vueuse/core";
import moment from "moment";

import { DroneStatusEnum, IsControlDrone, WorkPreview, AirportCharger, DRONEALIVE, DroneControlPower, VIDEOTYPE } from "@/enums/droneTask";
import { weatherStaticData, airportStaticData, droneStaticData, PTZControlList } from "./static-data";
// 图片批量引入
import imagesMap from "@/assets/images_js";

import * as droneControlApi from "@/api/interface/monitoring/drone-control";
import * as cameraControlApi from "@/api/interface/monitoring/camera-control";
import * as airportManageApi from "@/api/interface/equipment-manage/airport";
import * as monitorApi from "@/api/interface/monitoring/monitor";

import DroneCesiumMap from "./components/drone-cesium-map/drone-cesium-map.vue";
import WorkDataContainer from "./components/work-data-container/work-data-container.vue";
import RtmpVideo from "@/views/monitoring/real-time-monitoring/components/rtmp-video/rtmp-video.vue";
import TaskLogCard from "./components/task-log-card/task-log-card.vue";
import TaskPlanCard from "./components/task-plan-card/task-plan-card.vue";
import PTZControlCard from "./components/PTZ-control-card/PTZ-control-card.vue";
import ControlBottomContent from "./components/control-bottom-content/control-bottom-content.vue";
import WorkProgressBar from "./components/work-progress-bar/work-progress-bar.vue";
import DataInfoCard from "./components/data-info-card/data-info-card.vue";

const route = useRoute();
// 在setup函数中获取实例对象并定义bus
const instance = getCurrentInstance();
const bus = instance?.appContext.config.globalProperties.$bus;
const app = getCurrentInstance()?.appContext.config.globalProperties;

const payloadIndex = "53-0-0"; //负载编号 先抄了前任的编码
const droneStatus = ref(DroneStatusEnum.NOWORK); //无人机状态：1工作中 还是非工作0
const isControl = route.query.type || IsControlDrone.NO; // 是否是操控状态 control=控制
const airportId = route.params.id || ""; // 机场id
const droneVideoUrl = ref("");
const airportVideoUrl = ref("");
let droneVideoList: { [key: string]: any }[] = [];//无人机视频选项列表
let airportVideoList: { [key: string]: any }[] = [];//机场视频选项列表
const previewRange = ["2023-08-03 15:55:00", "2023-08-03 15:55:40"];//作业回放的时间段

let weatherData = ref({});//ws接受的气象数据
let airportData: Ref<{ [key: string]: any }> = ref({});//ws接受的机场状态数据
let droneData: Ref<{ [key: string]: any }> = ref({});//ws接受的飞行器状态数据

let workTopData: Ref<{ [key: string]: any }> = ref({});//ws接受的工作中顶部数据

let cesuimMap = ref() ;//地图ref

// webscoket的方法
let wsOpen: any = null;
let wsClose: any = null;
let wsSend: any = null;

const state: {
  wsData: any
  airportDetail: { [key: string]: any }
} = reactive({
  wsData: null,
  airportDetail: {}, //机场普通基本信息
});
let { wsData, airportDetail } = toRefs(state);


// 顶部数据
const headData = computed(() => {
  const topData = workTopData.value;
  const droneInfo = droneData.value;
  // 当前航点 根据point_list的current=1判断
  let currentPatrol = topData.point_list ? topData.point_list.findIndex(i => i.current === 1) + 1 : 0;
  const data = [
    { name: "航点", value: `${currentPatrol} / ${topData.point_list?.length ?? 0}`, icon: imagesMap["site"], progress: Math.floor(currentPatrol / topData.point_list * 100) },
    { name: "检测点", value: `${topData.already_patrol_num ?? 0}/${topData.total_patrol_num ?? 0}`, icon: imagesMap["site"], progress: Math.floor(topData.already_patrol_num / topData.total_patrol_num * 100) },
    { name: "电量", value: `${droneInfo.drone_battery ?? 0}%`, icon: imagesMap["power"], progress: droneData.value.drone_battery ?? 0 },
    { name: "剩余里程(m)", value: topData.remaining_mileage ?? 0, icon: imagesMap["mileage"], progress: 100 },
    { name: "剩余时间", value: formatDurationTime(topData.remaining_second), icon: imagesMap["time"], progress: 100 },
  ];
  // 控制顶部数据暂时不要
  const controlData = [
    // {name:'控制延时',value:'300ms',icon:imagesMap['time'],progress:30},
    // {name:'速度(m/s)',value:`${droneInfo.drone_speed}/`,icon:imagesMap['speed'],progress:70},
    // {name:'高度(m)',value:`${droneInfo.drone_height}/`,icon:imagesMap['height'],progress:50},
    // {name:'飞行距离(m)',value:'1832',icon:imagesMap['mileage'],progress:100},
    // {name:'当前电量',value:`${droneData.value.drone_battery ?? 0}%`,icon:imagesMap['power'],progress:droneData.value.drone_battery ?? 0},
  ];
  return isControl === IsControlDrone.YES ? controlData : data;
});

//无人机普通基本信息
const droneDetail = computed(() => {
  return airportDetail.value.children?.length ? airportDetail.value.children[0] : {};
});



// 是否作业回放预览
const isPreview = computed(() => {
  const val = route.query.preview || "";
  return WorkPreview.YES === val;
});

watch(wsData, (val) => {
  if (!val) return;
  const data = JSON.parse(val);
  console.log("ws来消息了======>", data);
  wsDataAssign(data);
});

onMounted(async () => {
  isPreview.value && bus.on("videoPlaying", updateCurrentTimeData);
  openWs();
  getCameraInfo();
  await getAirportDetail();

});

onUnmounted(() => {
  wsClose && wsClose();
  isPreview.value && bus.off("videoPlaying", updateCurrentTimeData);
});

// 获取机场信息详情
const getAirportDetail = async () => {
  try {
    const { data } = await airportManageApi.getAirportAndDroneInfo(airportId);
    airportDetail.value = data;
  } catch (error) {
    console.log(error);
  }
};

// 获取视频
const getCameraInfo = async () => {
  const params = {
    deviceSnList: ["4TADL2P001000J" || airportDetail.value.deviceSn, "1581F5BM32355001E051" || droneDetail.value.deviceSn],
  };
  const { data } = await monitorApi.getDroneCameraInfo(params);
  handleAirportAndDroneSort(data);
};

// 处理视频数据根据deviceSn给每一个机场和无人机添加视频数据 视频可以是多个
const handleAirportAndDroneSort = (videoList) => {
  const videoObject = videoList.reduce((acc, videoItem) => {
    if (acc[videoItem.type]) {
      acc[videoItem.type].push(videoItem);
    } else {
      acc[videoItem.type] = [videoItem];
    }
    return acc;
  }, {});

  // 给无人机还有机场地址list赋值 
  airportVideoList = videoObject[VIDEOTYPE.AIRPORT] || [];
  droneVideoList = videoObject[VIDEOTYPE.DRONE] || [];

  // 给无人机还有机场视频地址赋值 
  airportVideoUrl.value = airportVideoList[0]?.videoUrl;
  droneVideoUrl.value = droneVideoList[0]?.videoUrl;
};

// 云台重置
const handlePTZControlCommand = async (val) => {
  const params = {
    droneCode: airportDetail.value.airportSn,
    payloadIndex,
    resetMode: val,
  };
  const { status: { code, msg } } = await cameraControlApi.gimbalReset(params);
  if (code !== 1) return;
  app?.$message.success(msg);
};

// 相机模式切换
const handleCameraCommand = async (item) => {
  const params = {
    droneCode: airportDetail.value.airportSn,
    cameraMode: item,
    payloadIndex: payloadIndex,
  };
  const { status: { code, msg } } = await cameraControlApi.cameraModeSwitch(params);
  if (code !== 1) return;
  app?.$message.success(msg);
};

// 云台方向控制事件
const onPTZControl = (params) => {

};

// 云台变焦控制事件
const onChangePTZZoom = async (val) => {
  const params = {
    droneCode: airportDetail.value.airportSn,
    payloadIndex: payloadIndex,
    cameraType: "zoom",
    zoomFactor: val,
  };
  const { status: { code, msg } } = await cameraControlApi.cameraModeSwitch(params);
  if (code !== 1) return;
  app?.$message.success(msg);
};

// 云台拍照
const PTZTakePhoto = async (val) => {
  const map = {
    1: "cameraPhotoTake",
    2: "cameraRecordingStart",
    3: "cameraRecordingStop",
  };
  const params = {
    droneCode: airportDetail.value.airportSn,
  };
  const { status: { code, msg } } = await cameraControlApi[map[val]](params);
  if (code !== 1) return;
  app?.$message.success(msg);


};

// 工作回放进度改变 时间修改数据过滤:应该要把展示的数据展示成当前时间的数据
const updateCurrentTimeData = () => {
};

// 创建ws
const openWs = () => {
  // websocket
  const { status, data, send, open, close } = useWebSocket(import.meta.env.VITE_WS_URL + "net/websocket/a", {
    // autoClose:false,
    // autoReconnect: true,
  });
  wsClose = close;
  wsOpen = open;
  wsSend = send;
  wsData.value = data;

};

// ws接受数据处理
const wsDataAssign = (val) => {
  // 200 300  1 2 3这些都是后端ws数据返回的值 用来判断返回是哪些数据
  const map = {
    200: {
      1: weatherData,
      2: airportData,
      3: droneData,
    },
    300: {
      1: workTopData,
    },
  };
  switch (val.Address) {
  case 200:
    // 机场状态数据
    if (val.FunCode === 2) {
      val.Data.drone_charge_state = val.Data.drone_charge_state === AirportCharger.CHARGING ? "充电中" : "空闲";
    }
    map[val.Address][val.FunCode].value = val.Data;
    break;
  case 300:
    if (val.FunCode === 1) {
      // 收到这个消息 有code或者name就是工作中
      droneStatus.value = val.Data.current_task_code ? DroneStatusEnum.WORK : DroneStatusEnum.NOWORK;
    }
    map[val.Address][val.FunCode].value = val.Data;
    break;
  default:
    break;
  }
};

// 把秒转为HH:mm:ss
const formatDurationTime = (data) => {
  if (!data) return "00:00:00";
  let time = moment.duration(data, "seconds");
  let hours = time.hours();
  let minutes = time.minutes();
  let seconds = time.seconds();
  return moment({ h: hours, m: minutes, s: seconds }).format("HH:mm:ss");
};

// 抢夺控制：飞行、负载,智能返航，急停 一键起飞 ONETOUCH
const onChangeControlType = async (val) => {
  switch (val) {
  case DroneControlPower.ONETOUCH:
    cesuimMap.value.handleTakeOffDialog(true);
    break;
  default:
    // 无人机其他控制操作
    droneControlFunc(val);
    break;
  }
  
};

const droneControlFunc = async (val) => {
  // KEY表示传过来的val值，value是接口名字
  const map = {
    [DroneControlPower.FLY]: "flightAuthorityGrab",
    [DroneControlPower.LOAD]: "payloadAuthorityGrab",
    [DroneControlPower.RETURN]: "oneClickReturn",
    [DroneControlPower.STOP]: "droneEmergencyStop",
  };
  const params = {
    droneCode: airportDetail.value.airportSn,
  };
  const { status: { code, msg } } = await droneControlApi[map[val]](params);
  if (code !== 1) return;
  app?.$message.success(msg);
};
// 控制无人机飞行事件
const onDroneMove = (data) => {
  const params = { "Address": 100, "FunCode": 1, "droneCode": airportDetail.value.airportSn, "Data": data };
  // console.log("data ======>", JSON.stringify(params));
  const result = wsSend(JSON.stringify(params));
  console.log(result);
};

provide("droneData", droneData);
provide("airportData", airportData);
provide("airportDetail", airportDetail);

</script>
<style lang="scss" scoped>
@import './drone-work-detail.scss'
</style>
