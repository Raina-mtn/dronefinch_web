import { defHttp } from "@/api/http";

// 获取线路管理list
export const getRouteManageList = (params) => {
  return defHttp.get({
    url: "/sps/v1/line",
    params,
  });
};


// 新增和编辑线路
export const addRoute = (params) => {
  return defHttp.post({
    url: "/sps/v1/line",
    params,
  });
};
// 新增和编辑线路
export const editRoute = (id, params) => {
  return defHttp.post({
    url: `/sps/v1/line/update/${id}`,
    params,
  });
};

// 删除线路
export const deleteRoute = (id) => {
  return defHttp.get({
    url: `/sps/v1/line/delete/${id}`,
  });
};


// 获取机场和无人机信息
export const getLineDetail = (id) => {
  return defHttp.get({
    url: `/sps/v1/line/${id}`,
  });
};

// 运维管理-设备台账-线路名称下拉选项list
export const getLineSelectList = (params) => {
  return defHttp.get({
    url: "/sps/v1/line/select",
    params,
  });
};


