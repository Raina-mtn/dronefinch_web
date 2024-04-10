import { defHttp } from "@/api/http";
// 审核
export const get = (params) => {
  return defHttp.get({
    url: "/sps/v1/task-review/",
    params,
  });
};
// 审核-获取tab
export const getTab = (params) => {
  return defHttp.get({
    url: `/sps/v1/task-review/${params.id}/classify`,
    params,
  });
};
// 审核-获取图片列表
export const getImageList = (params) => {
  return defHttp.get({
    url: `/sps/v1/task-review/${params.id}/image`,
    params,
  });
};
// 审核-获取图片详情
export const getImageDetail = (params) => {
  return defHttp.get({
    url: `/sps/v1/task-review/${params.jobId}/${params.id}/info`,
    params,
  });
};
// 审核-重新检测
export const getImageRecheck = (params) => {
  return defHttp.post({
    url: "/sps/v1/task-review/recheck",
    params,
  });
};
// 审核-绑定设备部件
export const getImageBind = (params) => {
  return defHttp.post({
    url: "/sps/v1/task-review/bind",
    params,
  });
};
// 审核-提交设备部件
export const getImageSubmit = (params) => {
  return defHttp.post({
    url: "/sps/v1/task-review/submit",
    params,
  });
};

// 任务记录-完成审核
export const finish = (params) => {
  return defHttp.post({
    url: `/sps/v1/task-review/finish/${params}`,
  });
};
