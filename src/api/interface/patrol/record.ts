import { defHttp } from "@/api/http";
// 任务记录
export const get = (params) => {
  return defHttp.get({
    url: "/sps/v1/task-record",
    params,
  });
};
// 任务记录-结束
export const stop = (params) => {
  return defHttp.get({
    url: `/sps/v1/task-instance/${params}/stop`,
    params,
  });
};
// 任务记录-下载
export const download = (params) => {
  return defHttp.get({
    url: `/sps/v1/task-report/${params}/export`,
    params,
  });
};