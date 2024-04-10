import { defHttp } from "@/api/http";

// 实时监测-分页查询计划
export const getMonitorTaskPlan = (params) => {
  return defHttp.get({
    url: "/sps/v1/task-plan/monitor",
    params,
  });
};