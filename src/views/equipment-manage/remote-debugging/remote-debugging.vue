<template>
  <div class="text-white w-full h-[calc(100%-24px)] bg-[#0B2363] my-6 px-4 py-6.5">
    <section class="flex justify-between items-center">
        <div>
            <div class="flex items-center">
                <span class='text-sm mr-2'>调试模式</span>
                <el-switch v-model="debugging" />
            </div>
        </div>
        <div>
            <div @click="goBack" class="flex items-center justify-center cursor-pointer !text-primary text-sm h-10 w-21.5 border border-solid border-primary rounded">
                <el-icon><ArrowLeft /></el-icon>
                <span class="ml-2.5">返回</span>
            </div>
        </div>
    </section>

    <!-- 机场 -->
    <section class="flex justify-between  bg-[#193580] p-6 mt-6">
        <RemoteItem :detail="airportInfo" :buttonList="airportButtonList" class="flex-1" @onRemote="onRemoteControl" />
        <div class="flex justify-center items-center h-80 w-154 flex-shrink-0 ml-6">
            <RtmpVideo v-if="airportVideoUrl" :videoSrc="airportVideoUrl" class="w-full h-full relative">
            </RtmpVideo>
            <img v-else src="@/assets/images/no-video.png" class="w-50 h-50">
        </div>
    </section>
    <!-- 无人机 -->
    <section class="flex justify-between  bg-[#193580] p-6 mt-6">
        <RemoteItem :detail="airportInfo" :buttonList="droneButtonList" class="flex-1" @onRemote="onRemoteControl" />
        <div class="flex justify-center items-center h-80 w-154 flex-shrink-0 ml-6">
            <RtmpVideo v-if="droneVideoUrl" :videoSrc="droneVideoUrl" class="w-full h-full relative">
                <div  class="url-select absolute top-4 right-4">
                <el-select 
                    v-model="droneVideoUrl" 
                    class="m-2" 
                    size="large" 
                    placement="bottom-end"
                >
                    <el-option
                    v-for="item in droneVideoList"
                    :key="item.url"
                    :label="item.name"
                    :value="item.url"
                    />
                </el-select>
                </div>
            </RtmpVideo>
            <img v-else src="@/assets/images/no-video.png" class="w-50 h-50">
        </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import {ref, reactive, getCurrentInstance, onMounted, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import * as airportManageApi from "@/api/interface/equipment-manage/airport";
// import {  } from './config';
// 图片批量引入
import imagesMap from "@/assets/images_js";
import RtmpVideo from "@/views/monitoring/real-time-monitoring/components/rtmp-video/rtmp-video.vue";
import RemoteItem from "./components/remote-item/remote-item.vue";


// 获取app的全局属性
const app = getCurrentInstance()?.appContext.config.globalProperties;
const route = useRoute();
const router = useRouter();


let debugging = ref(false);//调试模式
let airportInfo = ref({});//机场信息
let dronetInfo = ref({});//无人机信息
let id = route.query.id || ""; //id
let droneVideoUrl = ref("http://172.17.11.29:9999/live/4TADK8B000001C_165-0-7_normal-0.flv");//无人机视频
let airportVideoUrl = ref("http://172.17.11.29:9999/live/4TADK8B000001C_165-0-7_normal-0.flv");//机场视频
let droneVideoList = [
  {name:"M30T云台相机", url:"http://172.17.11.29:9999/live/4TADK8B000001C_165-0-7_normal-0.flv"},
  {name:"M20T云台相机", url:"http://172.17.11.29:9999/live/4TADK8B000001C_165-0-7_normal-0.flv"},
  {name:"M10T云台相机", url:"http://172.17.11.29:9999/live/4TADK8B000001C_165-0-7_normal-0.flv"},
];//无人机下拉选项

// 机场操作按钮数据
const airportButtonList = computed(() => {
  const arr = [
    {name:"机场状态", image:imagesMap["remote-status"], text:"工作中", buttonText:"重启", id:"1"},
    {name:"舱盖", image:imagesMap["remote-door"], text:"关", buttonText:"开启", id:"2"},
    {name:"推杆", image:imagesMap["remote-putter"], text:"展开", buttonText:"闭合", id:"3"},
    {name:"补光灯", image:imagesMap["remote-light"], text:"关", buttonText:"开启", id:"4"},
    {name:"声光报警", image:imagesMap["remote-police"], text:"关", buttonText:"开启", id:"5"},
    {name:"机场存储", image:imagesMap["remote-storage"], text:"1.2/8G", buttonText:"格式化", id:"6"},
  ];
  return arr;
});

// 无人机操作按钮数据
const droneButtonList = computed(() => {
  const arr = [
    {name:"飞行器状态", image:imagesMap["remote-status"], text:"开机", buttonText:"关机", id:"7"},
    {name:"4G图传", image:imagesMap["remote-4g"], text:"关", buttonText:"开启", id:"8"},
    {name:"飞行器充电", image:imagesMap["remote-charge"], text:"未充电", buttonText:"充电", id:"9"},
    {name:"电池保养", image:imagesMap["remote-maintain"], text:"关闭", buttonText:"开启", id:"10"},
    {name:"飞行器存储", image:imagesMap["remote-storage"], text:"1.2/8G", buttonText:"格式化", id:"11"},
  ];
  return arr;
});

onMounted(() => {
  getDetail();
});

// 获取详情
const getDetail = async () => {
  const params = {id};
  const {status:{msg, code}} = await airportManageApi.getAirportInfo(params);
  if (code !== 1) return app?.$message.error(msg);
};

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 远程控制
const onRemoteControl = (item) => {
  console.log(item);
};





</script>
<style lang="scss" scoped>
@import './remote-debugging.scss'



</style>