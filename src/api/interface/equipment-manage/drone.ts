import { defHttp } from "@/api/http";

// 查询可绑定的飞行器
export const getUnbindDronList = (params) => {
  return defHttp.get({
    url: '/sps/v1/drone/unbind',
    params,
  });
};