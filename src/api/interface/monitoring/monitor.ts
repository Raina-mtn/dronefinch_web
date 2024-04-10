import { defHttp } from "@/api/http";

// 获取相机信息
export const getDroneCameraInfo = (params = {}) => {
  return defHttp.post({
    url: "/monitor/getCameraInfo",
    params,
  });
};

// 获取模型信息
export const getModel = () => {
  return defHttp.post({
    url: "/monitor/getModel",
  });
};