import { defHttp } from "@/api/http";

// 获取机场管理list
export const getAirportManageList = (params) => {
  return defHttp.get({
    url: "/sps/v1/airport",
    params,
  });
};
// 删除
export const deleteRecord = (id) => {
  return defHttp.get({
    url: `/sps/v1/airport/delete/${id}`,
  });
};

// 新增记录
export const addRecord = (params) => {
  return defHttp.post({
    url: "/sps/v1/airport",
    params,
  });
};

// 编辑记录
export const editRecord = (id, params) => {
  return defHttp.post({
    url: `/sps/v1/airport/update/${id}`,
    params,
  });
};

// 获取机场和无人机信息
export const getAirportInfo = (id) => {
  return defHttp.get({
    url: `/sps/v1/airport/${id}`,
  });
};

// 实时监测详情-获取机场和无人机信息
export const getAirportAndDroneInfo = (id) => {
  return defHttp.get({
    url: `sps/v1/home/basic/${id}`,
  });
};

// 获取告警信息list
export const getWarningList = (params) => {
  return defHttp.get({
    url: "/sps/v1/airport/alarm",
    params,
  });
};