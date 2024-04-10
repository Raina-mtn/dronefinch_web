import { defHttp } from "@/api/http";

// 获取所有的字典类型
export const getTotalDict = (params) => {
  return defHttp.get({
    url: "/sps/v1/dict/total",
    params,
  });
};

// 获取指定类型的字典
export const getDictTree = (params) => {
  return defHttp.get({
    url: "/sps/v1/dict/tree",
    params,
  });
};
