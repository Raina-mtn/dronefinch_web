<!--
 * @Author: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @Date: 2023-11-30 14:13:18
 * @LastEditors: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @LastEditTime: 2023-12-04 12:47:12
 * @FilePath: \dronefinch_web\src\views\monitoring\drone-work-detail\components\drone-cesium-map\drone-cesium-map.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="map-container w-full h-full ">
    <vc-viewer @ready="onViewerReady" @leftClick="handleMapClick">
      <!-- 采用天地图 wgs84坐标系 -->
      <!-- 注记层底图 -->
      <vc-layer-imagery :sort-order="20">
        <vc-imagery-provider-tianditu map-style="cva_c"
          token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
      </vc-layer-imagery>

      <!-- 影像底图 -->
      <vc-layer-imagery :sort-order="10">
        <vc-imagery-provider-tianditu :map-style="mapStyle" token="436ce7e50d27eede2f2929307e6b33c0" :maximumLevel="17"
          ref="provider"></vc-imagery-provider-tianditu>
      </vc-layer-imagery>

      <!-- 导入3d模型建筑 -->
      <vc-primitive-tileset
        ref="primitive"
        :url="tilesetUrl"
        v-if="true" 
        maximumScreenSpaceError='1'
        @ready="onTilesetReady"
      >
      </vc-primitive-tileset>

      <!-- 起飞图标 -->
      <vc-entity v-if="flight.lat && flight.lng"
        :position="flight">
        <vc-graphics-billboard 
          :image="imagesMap['position']" 
          :scale="0.5" 
          :distance-display-condition="distanceDisplayCondition"></vc-graphics-billboard>
      </vc-entity>

      <!-- 机场位置 -->
      <vc-entity v-if="airportData.air_port_longitude && airportData.air_port_latitude"
        :position="{ lng: airportData.air_port_longitude, lat: airportData.air_port_latitude, height: airportData.air_port_height }">
        <vc-graphics-billboard :image="imagesMap['airport']" :scale="0.5"
          :distance-display-condition="distanceDisplayCondition"></vc-graphics-billboard>
      </vc-entity>

      <!-- 无人机位置 -->
      <vc-entity @ready="droneEntityReady" v-if="droneData.drone_longitude && droneData.drone_latitude"
        :position="{ lng: droneData.drone_longitude, lat: droneData.drone_latitude, height: droneData.drone_height }">
        <vc-graphics-billboard :image="imagesMap['drone']" :scale="0.5"
          :distance-display-condition="distanceDisplayCondition"></vc-graphics-billboard>
      </vc-entity>

      <!-- 航点text -->
      <vc-collection-label :labels="flightLabels" :sort-order="100">
      </vc-collection-label>

      <!-- 航点icon -->
      <vc-collection-billboard ref="billboardCollectionRef" :billboards="flightPointBillboards" :sort-order="30">
      </vc-collection-billboard>

      <!--飞行路线 -->
      <vc-collection-polyline @ready="polylineReady">
        <vc-polyline :position="positionList" :material="{
          fabric: {
            type: 'Color',
            uniforms: {
              color: 'rgba(5, 213, 144, 1)'
            }
          }
        }" :width="6"></vc-polyline>
      </vc-collection-polyline>


    </vc-viewer>

    <section class="absolute bottom-8 right-23.54vw ">
      <div
        :class="['flex items-center justify-center w-2.7vw h-1.66vw cursor-pointer rounded mb-2.5 map-style-item text-0.625vw', { active: item.style === mapStyle }]"
        v-for="item in mapStyleList" :key="item.style" @click="onChangeMapStyle(item.style)">
        {{ item.name }}
      </div>
    </section>

     <!-- 地图弹窗 -->
     <section class="z-10 absolute top-35.5 map-dialog w-80" v-if="flight.show">
      <div class="title pl-6 pr-6 h-8 leading-loose">请在地图中选择一键起飞目标点</div>
      <div class="py-4 px-6 text-sm">
        <div class="mb-3.5">经度：{{ flight.lng }}</div>
        <div class="mb-3.5">纬度：{{ flight.lat }}</div>
        <div class="mb-4"><span>起飞高度(m)：</span>
          <el-input class="w-44.7" v-model="flight.height" />
        </div>
        <el-button-group class="flex justify-end">
          <el-button class="btn btn-left" type="primary" @click="handleTakeOffDialog(false)">取消</el-button>
          <el-button class="btn btn-right" type="primary" @click="confirmTakeOff">
            确定
          </el-button>
        </el-button-group>
      </div>
    </section>

  </div>
</template>
<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted, onBeforeMount, onUnmounted, watch, inject } from "vue";
import type { Ref } from "vue";
import { isEqual } from "lodash";
// 图片批量引入
import imagesMap from "@/assets/images_js";
import * as monitorApi from "@/api/interface/monitoring/monitor";
import * as droneControlApi from "@/api/interface/monitoring/drone-control";
import { getCatesian3FromPX, radToDeg } from "@/utils/cesiumUtil";

interface Position {
  lng?: number;
  lat?: number;
  height?: number;
}
interface Billboards {
  position?: number[];
  scale?: number;
  width?: number;
  height?: number;
  image?: string;
  id?: string,
  pixelOffset?: object
}
interface Props {
  isPreview?: boolean
  positions?: any[]
}

// 在setup函数中获取实例对象并定义bus
const instance = getCurrentInstance();
const bus = instance?.appContext.config.globalProperties.$bus;
const app = getCurrentInstance()?.appContext.config.globalProperties;

// const props = defineProps(['isPreview']);
const props = withDefaults(defineProps<Props>(), {
  isPreview: false,
  positions: () => [],
});

const droneData = inject("droneData", { drone_longitude: 119.96066602207962, drone_latitude: 30.283283037250406, drone_height: 0 });
const airportData = inject("airportData", { air_port_longitude: 0, air_port_latitude: 0, air_port_height: 0 });
const airportDetail = inject("airportDetail", { airportSn:"" });

let viewer;
let tilesetUrl = ref("");//3D模型地址
let mapStyle: Ref = ref("img_w"); //地图底图 img_w=影像  vec_w=矢量
let positionList: Ref<Position[]> = ref([]);//飞行路径数据
let flightPointBillboards: Ref<Billboards[]> = ref([]);//飞行路径数据
let flightLabels: Ref = ref([]);//航点text
const distanceDisplayCondition = { near: 0, far: 20000000 };

const mapStyleList = [
  { name: "标准图", style: "vec_w" },
  { name: "卫星图", style: "img_w" },
];//地图底图按钮切换list

//地图弹窗数据
let flight = reactive({
  lng: 0, //经度
  lat: 0, //纬度
  height: 0,
  show: false,
});

//航线变化 重新绘制航线
watch(() => props.positions, (val, oldVal) => {
  if (isEqual(val, oldVal)) return;
  getFlightPath();
});

onBeforeMount(() => {
  getModel();
});

onMounted(() => {
  props.isPreview && bus.on("videoPlaying", updateCurrentTimeData);
});

onUnmounted(() => {
  props.isPreview && bus.off("videoPlaying", updateCurrentTimeData);
});

// 获取模型
const getModel = async () => {
  const { data: { modelUrl } } = await monitorApi.getModel();
  tilesetUrl.value = modelUrl;
};

// viewer初始化
const onViewerReady = ({ Cesium, viewer: v }) => {
  viewer = v;
  if (viewer) {
    // 启用使用场景光源照亮地球
    viewer.scene.globe.enableLighting = true;
    // 去掉cesium logo
    viewer._cesiumWidget._creditContainer.style.display = "none";
    getFlightPath();
  }
  // const position = Cesium.Cartesian3.fromDegrees(119.96135338404272, 30.283237526575032, 200);
  // flyTo(viewer.camera, position, 0.5, 0);

};

// 3dtileset模型导入初始化
const onTilesetReady = ({ cesiumObject: tileset, viewer }) => {
  // const p = new Cesium.Cartesian3(-2448251.9880880537
  //     ,5364537.226776164
  //     ,2422577.290257676);
  // viewer.zoomTo(p);
  viewer.zoomTo(tileset);
};

// 切换底图
const onChangeMapStyle = (style) => {
  mapStyle.value = style;
};

// 获取飞行路线数据
const getFlightPath = () => {
  // const data = flightData.data.waypointGroup[0].flightPathWaypoint;
  props.positions.forEach((element, i) => {
    // 处理postion
    positionList.value.push({ lng: element.lon, lat: element.lat, height: element.height });

    // 起点icon的offset不同
    let pixelOffsetIcon = i === 0 ? { x: 20, y: 0 } : { x: 0, y: -20 };
    // 航点背景
    flightPointBillboards.value.push({
      position: [element.lon, element.lat, element.height],
      image: i === 0 ? imagesMap["start-site"] : imagesMap["fly-site"],
      id: element.id,
      width: i === 0 ? 40 : 46, //起点icon的width不同
      height: 40,
      pixelOffset: pixelOffsetIcon,
    });
    // 航点文字：起点不用
    if (i !== 0) {
      flightLabels.value.push({
        position: { lng: element.lon, lat: element.lat, height: element.height },
        pixelOffset: { x: -15, y: -16 },
        font: "16px sans-serif",
        text: i < 10 ? "0" + i : (i + 1).toString(),
        showBackground: true,
        backgroundColor: "rgba(255,255,255,0)",
      });
    }
  });



};

// 设置camera到航线
const polylineReady = () => {
  // console.log('polylineReady');
  // //暂时取第8点设置camera
  // const num = 0;
  // const position = Cesium.Cartesian3.fromDegrees(positionList.value[num].lng, positionList.value[num].lat, positionList.value[num].height);
  // console.log(position);
  // flyTo(viewer.camera, position, 0.5, 20);

};

//视图切换到无人机位置
const droneEntityReady = ({ cesiumObject }) => {
  viewer.zoomTo(cesiumObject);
};

// 改变无人机位置
const updateDronePosition = () => {
};

// 工作回放 进度条改变时间触发事件
const updateCurrentTimeData = ({ time }) => {
  // console.log(time);
};

// 地图左侧点击事件
const handleMapClick = ({position}) => {
  if (!flight.show) return;
  const clickPosition = getCatesian3FromPX(viewer, position);
  const gps = Cesium.Cartographic.fromCartesian(clickPosition, Cesium.Ellipsoid.WGS84, new Cesium.Cartographic());
  flight.lng = radToDeg(gps.longitude);
  flight.lat = radToDeg(gps.latitude);
  flight.height = gps.height;
};


// 关闭一件起飞弹窗
const  handleTakeOffDialog = (val) => {
  flight.show = val;
  flight.lat = 0;
  flight.lng = 0;
};

//确认一键起飞
const confirmTakeOff = async () => {
  const params = {
    deviceSn: airportDetail.value.deviceSn,
    targetHeight: flight.height,
    targetLatitude: flight.lat,
    targetLongitude: flight.lng,
  };
  const { status: { code, msg } } = await droneControlApi.takeoffToPoint(params);
  if (code !== 1) return;
  app?.$message.success(msg);
  handleTakeOffDialog(false);
};

defineExpose({
  handleTakeOffDialog,
});

</script>
<style lang="scss" scoped>
@import './drone-cesium-map.scss'
</style>
