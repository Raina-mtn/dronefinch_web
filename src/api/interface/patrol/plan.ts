import { defHttp } from "@/api/http";
// 任务计划
export const get = (params) => {
  return defHttp.get({
    url: "/sps/v1/task-plan",
    params,
  });
};

// 任务计划-新增
export const add = (params) => {
  return defHttp.post({
    url: "/sps/v1/task-plan",
    params,
  });
};

// 任务计划-更新
export const update = (params) => {
  return defHttp.post({
    url: `/sps/v1/task-plan/update/${params.id}`,
    params,
  });
};

// 任务计划-删除
export const del = (params) => {
  return defHttp.get({
    url: `/sps/v1/task-plan/delete/${params}`,
    params,
  });
};

// 任务计划-航线管理查询
export const getWayline = (params) => {
  return defHttp.get({
    url: "/sps/v1/wayline/select",
    params,
  });
};

// 任务计划-航线名称
export const getLineDetail = (params) => {
  return defHttp.get({
    url: `/sps/v1/wayline/${params}`,
  });
};

// 任务计划-立即执行
export const startPlan = (params) => {
  return defHttp.get({
    url: `/sps/v1/task-instance/${params}/start`,
  });
};
