import { defHttp } from "@/api/http";
// 航线管理
export const get = (params) => {
  return defHttp.get({
    url: "/sps/v1/wayline",
    params,
  });
};

export const add = (params) => {
  return defHttp.post({
    url: "/sps/v1/wayline",
    params,
  });
};

export const update = (params) => {
  return defHttp.post({
    url: `/sps/v1/wayline/update/${params.id}`,
    params,
  });
};

export const del = (params) => {
  return defHttp.get({
    url: `/sps/v1/wayline/delete/${params}`,
  });
};

// 机库-下拉框
export const getAirportSelect = (params) => {
  return defHttp.get({
    url: "/sps/v1/airport/select",
    params,
  });
};

// 航点动作-分页
export const getWaylineList = (params) => {
  return defHttp.get({
    url: "/sps/v1/wayline-mark",
    params,
  });
};

// 航点动作-查询图库
export const getWaylineImage = (params) => {
  return defHttp.get({
    url: `/sps/v1/wayline-mark/${params.actionId}/store-image`,
    params,
  });
};

// 航点动作-设备部件
export const getWaylineParts = (params) => {
  return defHttp.get({
    url: "/sps/v1/wayline-mark/parts-page",
    params,
  });
};

// 航点动作-绑定设备部件
export const getBindParts = (params) => {
  return defHttp.post({
    url: "/sps/v1/wayline-mark/bind",
    params,
  });
};