/*
 * @Date: 2023-11-03 10:44:43
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-11-07 13:32:53
 * @FilePath: \dronefinch_web\src\api\interface\equipment\index.ts
 */
import { defHttp } from "@/api/http";

// h获取字典
export const apiGetDictTotal = () => {
  return defHttp.get({
    url: "/sps/v1/dict/total",
  },
  );
};

// h获取字典
export const apiGetDictTree = (params: object) => {
  return defHttp.get({
    url: "/sps/v1/dict/tree",
    params,
  });
};

// 获取机场
export const getAirportList = (params: object) => {
  return defHttp.get({
    url: "/sps/v1/airport",
    params,
  });
};

// 无人机
/// 获取列表
export const getDroneList = (params: object) => {
  return defHttp.get({
    url: "/sps/v1/drone",
    params,
  });
};

/// 添加
export const postDrone = (params: object) => {
  return defHttp.post({
    url: "/sps/v1/drone",
    params,
  });
};

/// 编辑
export const updateDrone = (params: object) => {
  return defHttp.post({
    url: `/sps/v1/drone/update/${params["id"]}`,
    params,
  });
};

/// 查询单条
export const getDrone = (id: number) => {
  return defHttp.get({
    url: `/sps/v1/drone/${id}`,
  });
};

/// 删除单条
export const deleteDrone = (id: number) => {
  return defHttp.delete({
    url: `/sps/v1/drone/${id}`,
  });
};


// 告警配置
/// 获取列表
export const getConfigAlarmList = (params: object) => {
  return defHttp.get({
    url: "/sps/v1/config-alarm",
    params,
  });
};

/// 添加
export const postConfigAlarm = (params: object) => {
  return defHttp.post({
    url: "/sps/v1/config-alarm",
    params,
  });
};

/// 编辑
export const updateConfigAlarm = (params: object) => {
  return defHttp.post({
    url: `/sps/v1/config-alarm/update/${params["id"]}`,
    params,
  });
};

/// 查询单条
export const getConfigAlarm = (id: number) => {
  return defHttp.get({
    url: `/sps/v1/config-alarm/${id}`,
  });
};

// 删除单条
export const deleteConfigAlarm = (id: number) => {
  return defHttp.get({
    url: `/sps/v1/config-alarm/delete/${id}`,
  });
};

/// 告警部件
export const getDevicePartsSelect = () => {
  return defHttp.get({
    url: "/sps/v1/device-parts/select",
  });
};

/// 告警部件
export const getDevicePartsTree = () => {
  return defHttp.get({
    url: "/sps/v1/device-parts/tree",
  });
};