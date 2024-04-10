import { defHttp } from "@/api/http";

// 获取设备名称
export const getDeviceList = () => {
  return defHttp.post({
    url: "/",
  });
};
// 获取覆盖路线
export const getOverlatPathList = () => {
  return defHttp.post({
    url: "/",
  });
};
// 获取设备状态
export const getDeviceStatusList = () => {
  return defHttp.post({
    url: "/",
  });
};
// 获取实时监测列表
export const getRealTimeMonitoringList = (params) => {
  return defHttp.get({
    url: "/sps/v1/home",
    params,
  });
};