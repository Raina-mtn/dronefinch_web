import { defHttp } from "@/api/http";

// 相机控制 - 变焦
export const cameraFocalLengthSet = (params) => {
  return defHttp.post({
    url: '/cameraControl/cameraFocalLengthSet',
    params,
  });
};

// 相机控制 - 切换相机模式
export const cameraModeSwitch = (params) => {
  return defHttp.post({
    url: '/cameraControl/cameraModeSwitch',
    params,
  });
};

// 相机控制 - 单拍
export const cameraPhotoTake = (params) => {
  return defHttp.post({
    url: '/cameraControl/cameraPhotoTake',
    params,
  });
};

// 相机控制 - 切换相机模式
export const cameraRecordingStart = (params) => {
  return defHttp.post({
    url: '/cameraControl/cameraRecordingStart',
    params,
  });
};

// 相机控制 - 停止录像
export const cameraRecordingStop = (params) => {
  return defHttp.post({
    url: '/cameraControl/cameraRecordingStop',
    params,
  });
};

// 相机控制 - 重置云台
export const gimbalReset = (params) => {
  return defHttp.post({
    url: '/cameraControl/gimbalReset',
    params,
  });
};