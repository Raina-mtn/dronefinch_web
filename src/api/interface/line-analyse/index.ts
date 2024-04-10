import { defHttp } from "@/api/http";

// 获取所有的线路告警数据
export const getAlarmList = (params) => {
  return defHttp.get({
    url: "/sps/v1/alarm",
    params,
  });
};

// 查询告警图片
export const getAlarmPicture = (params) => {
  return defHttp.get({
    url: `/sps/v1/alarm/${params['id']}/image`,
    params,
  });
};

//日统计数据查询
export const getAlarmDay = (params) => {
  return defHttp.get({
    url: "/sps/v1/alarm/day",
    params,
  });
};