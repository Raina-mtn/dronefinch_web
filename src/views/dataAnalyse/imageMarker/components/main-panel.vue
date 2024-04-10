<template>
  <div class="w-full h-full relative flex justify-center">
    <div id="map" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import AILabel from "ailabel";
import {ref, watch, nextTick } from "vue";
import {CurrenCheck} from "../interface";
// import { useRouter } from "vue-router";

interface Props{
  currenCheck:CurrenCheck
}
const props = defineProps<Props>();
const emit = defineEmits(["createInfo", "changePosition"]);
const gMap = ref();//图片标注实例
const gFeatureLayer = ref();//矢量图层
const gTextLayer = ref();//文字图层
const drawingStyle = ref({});//样式

// 生成对应文本
const setText = (text, id, position, offset = {x:0, y:-20}) => {
  const gFirstText = new AILabel.Text(
    id, // id
    {text: text, position:position, offset}, // shape
    {name: "文本"}, // props
    {fillStyle: "rgba(0, 0, 0, 0.60)", strokeStyle: "#000", background: true, globalAlpha: 1, fontColor: "#fff"}, // style
  );
  gTextLayer.value.addText(gFirstText);
};

// 新增
const createInfo = (type, info) => {
  emit("createInfo", {type, info});
};

// 初始化
const init = () => {
  // 初始化 
  gMap.value = new AILabel.Map("map", {
    center: {x: 515, y: 400}, // 为了让图片居中
    mode: "BAN", // 绘制线段
    refreshDelayWhenZooming: true, // 缩放时是否允许刷新延时，性能更优
    zoomWhenDrawing: false,
    panWhenDrawing: false,
    zoomWheelRatio: 5, // 控制滑轮缩放缩率[0, 10), 值越小，则缩放越快，反之越慢
    withHotKeys: true, // 关闭快捷键
  });
  // 图片层添加
  const gImageLayer = new AILabel.Layer.Image(
    "first-layer-image", // id
    {
      src: props.currenCheck.imageUrl,
      width: 1030,
      height: 800,
      crossOrigin: false, // 如果跨域图片，需要设置为true
      position: { // 左上角相对中心点偏移量
        x: 0,
        y: 0,
      },
    }, // imageInfo
    {name: "第一个图片图层"}, // props
    {zIndex: 5}, // style
  );
  // 添加到gMap对象
  gMap.value.addLayer(gImageLayer);

  //矢量图层添加
  gFeatureLayer.value = new AILabel.Layer.Feature(
    "first-layer-feature", // id
    {name: "矢量图层"}, // props
    {zIndex: 100}, // style
  );
  // 添加到gMap对象
  gMap.value.addLayer(gFeatureLayer.value);

  //文字图层添加
  gTextLayer.value = new AILabel.Layer.Text(
    "first-layer-text", // id
    {name: "第一个文本图层"}, // props
    {zIndex: 12, opacity: 1}, // style
  );
  gMap.value.addLayer(gTextLayer.value);


  //监听绘制
  gMap.value.events.on("drawDone", (type, data) => {
    if (type === "RECT") {
      const index = props.currenCheck.infoList.length ? Number(props.currenCheck.infoList[props.currenCheck.infoList.length - 1].num) + 1 : 1;
      const rectFeature = new AILabel.Feature.Rect(
        `feature${index}`, // id
        data, // shape
        {name: "矢量图形"}, // props
        drawingStyle.value, // style
      );
      gFeatureLayer.value.addFeature(rectFeature);
      //生成文本
      setText(`缺陷${index}`, `feature${index}`, {x:data.x + data.width, y:data.y});
      
      createInfo("RECT", data, index);
    }
    else if (type === "POLYGON") {
      const index = props.currenCheck.infoList.length ? Number(props.currenCheck.infoList[props.currenCheck.infoList.length - 1].num) + 1 : 1;
      const polygonFeature = new AILabel.Feature.Polygon(
        `feature${index}`, // id
        {points: data}, // shape
        {name: "矢量图形"}, // props
        {strokeStyle: "#d70007", lineJoin: "round", lineCap: "round", lineWidth: 5}, // style
      );
      gFeatureLayer.value.addFeature(polygonFeature);

      // 找到最右的点位
      const textPositionX = Math.max(...data.map(i => i.x));
      const textPosition = data.find(i => i.x === textPositionX);

      //生成文本
      setText(`缺陷${index}`, `feature${index}`, textPosition);

      createInfo("POLYGON", data, index);
    }
    else if (type === "MARKER") {
      const index = props.currenCheck.reviewCommentList.length ? Number(props.currenCheck.reviewCommentList[props.currenCheck.reviewCommentList.length - 1].num) + 1 : 1;
      //生成icon
      const marker = new AILabel.Marker(
        `marker${index}`, // id
        {
          src: "/public/assets/marker.png",
          position: data,
          offset: {
            x: -16,
            y: 32,
          },
        }, // markerInfo
        {name: "marker注记"}, // props
      );
      gMap.value.markerLayer.addMarker(marker);

      //生成文本
      setText(`备注${index}`, `marker${index}`, data, {x: 20, y: 0});
      createInfo("MARKER", data, index);
    }
  });
  // 双击选中编辑
  gMap.value.events.on("featureSelected", feature => {
    gMap.value.setActiveFeature(feature);
  });
  // 取消编辑
  gMap.value.events.on("featureUnselected", () => {
    // 取消featureSelected
    gMap.value.setActiveFeature(null);
  });
  // 编辑
  gMap.value.events.on("featureUpdated", (feature, shape) => {
    feature.updateShape(shape);
    gTextLayer.value.removeTextById(feature.id);
    const index = feature.id.includes("feature") ? feature.id.split("feature")[1] : feature.id.split("marker")[1];

    if (feature.type === "RECT"){
      setText(`缺陷${index}`, feature.id, {x:shape.x + shape.width, y:shape.y});
      emit("changePosition", {id:index, newPosition:[shape]});
    } else if (feature.type === "POLYGON"){
      // 找到最右的点位
      const textPositionX = Math.max(...shape.points.map(i => i.x));
      const textPosition = shape.points.find(i => i.x === textPositionX);
      setText(`缺陷${index}`, feature.id, textPosition);
      emit("changePosition", {id:index, newPosition:shape.points});
    }
  });

};

// 接口返回反显
const show = (currenCheck) => {
  // 生成矩形与多边形
  currenCheck.infoList && (currenCheck.infoList.map((i, index) => {
    const defectShape = JSON.parse(i.defectShape);
    if (i.shapeType === "Rect"){
      const gFeatureRect = new AILabel.Feature.Rect(
        `feature${index + 1}`, // id
        defectShape, // shape
        {name: "矢量图形"}, // props
        {strokeStyle: "#d70007", lineWidth: 5}, // style
      );
      gFeatureLayer.value.addFeature(gFeatureRect);
      
      //生成文本
      setText(`缺陷${index + 1}`, `feature${index + 1}`, {x:defectShape.x + defectShape.width, y:defectShape.y});
    } else {
      const polygonFeature = new AILabel.Feature.Polygon(
        `feature${index + 1}`, // id
        {points: defectShape}, // shape
        {name: "矢量图形"}, // props
        {strokeStyle: "#d70007", lineJoin: "round", lineCap: "round", lineWidth: 5}, // style
      );
      gFeatureLayer.value.addFeature(polygonFeature);
      

      // 找到最右的点位
      const textPositionX = Math.max(...defectShape.map(i => i.x));
      const textPosition = defectShape.find(i => i.x === textPositionX);

      //生成文本
      setText(`缺陷${index + 1}`, `feature${index + 1}`, textPosition);
    }
  }));
  // 生成备注
  currenCheck.reviewCommentList && (currenCheck.reviewCommentList.map((i, index) => {
    const commentPoint = JSON.parse(i.commentPoint);
    const marker = new AILabel.Marker(
      `marker${index + 1}`, // id
      {
        src: "/public/assets/marker.png",
        position: commentPoint,
        offset: {
          x: -16,
          y: 32,
        },
      }, // markerInfo
      {name: "marker注记"}, // props
    );
    gMap.value.markerLayer.addMarker(marker);

    //生成文本
    setText(`备注${index + 1}`, `marker${index + 1}`, commentPoint, {x: 20, y: 0});
  }));
};
watch(() => props.currenCheck, async (newVal) => {
  if (newVal){
    // 初始化
    if (gMap.value){
      gMap.value.destroy();
      init();
      show(props.currenCheck);
    } else {
      await nextTick();
      init();
      show(props.currenCheck);
    }
  }
});

// defineExpose({
//   deleteGraphics,
// });
</script>

<style scoped>

#map {
  overflow: hidden;
  position: relative;
}

:deep(img){
  max-width:none;
}
</style>