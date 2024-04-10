import { defHttp } from "@/api/http";

// 无人机控制 - DRC飞行器急停
export const droneEmergencyStop = (params) => {
  return defHttp.post({
    url: "/droneControl/droneEmergencyStop",
    params,
  });
};

// 无人机控制 - 飞行控制权抢夺
export const flightAuthorityGrab = (params) => {
  return defHttp.post({
    url: "/droneControl/flightAuthorityGrab",
    params,
  });
};

// 无人机控制 - 一键返航
export const oneClickReturn = (params) => {
  return defHttp.post({
    url: "/droneControl/oneClickReturn",
    params,
  });
};

// 无人机控制 - 负载控制权抢夺
export const payloadAuthorityGrab = (params) => {
  return defHttp.post({
    url: "/droneControl/payloadAuthorityGrab",
    params,
  });
};

//一键起飞
export const takeoffToPoint = (params) => {
  return defHttp.post({
    url: "/droneControl/takeoffToPoint",
    params,
  });
};