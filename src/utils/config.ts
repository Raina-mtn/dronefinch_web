export const arrToObj = function (arr, format = {
  key: "value",
  label: "label",
}) {
  return arr.reduce(function (acc, cur) {
    const curkey = cur[format.key];
    acc[curkey] = cur[format.label];
    return acc;
  }, {});
};


// 任务结束后执行
export const doneAfterTaskEnd = [
  {
    label: "返回充电",
    value: 0,
  },
  {
    label: "返回原点",
    value: 1,
  },
  {
    label: "待在原地",
    value: 2,
  },
];

// 控制模式
export const modeOptions = [
  { label: "任务模式", value: 1 },
  { label: "紧急定位模式", value: 2 },
  { label: "后台遥控模式", value: 3 },
  { label: "手持遥控模式", value: 4 },
];

// 执行方式
export const operationOptions = [
  { label: "手动执行", value: "MANUAL" },
  { label: "定时执行", value: "TIMEING" },
  { label: "周期执行", value: "CYCLE" },
];
// 周期执行
export const cycleOptions = [
  { label: "天", value: "day" },
  { label: "周", value: "week" },
  { label: "月", value: "month" },
];
// 周
export const weekOptions = [
  { label: "周一", value: "1" },
  { label: "周二", value: "2" },
  { label: "周三", value: "3" },
  { label: "周四", value: "4" },
  { label: "周五", value: "5" },
  { label: "周六", value: "6" },
  { label: "周日", value: "7" },
];

// 缺陷等级
export const levelOptions = [
  {
    value:"1",
    label:"一般缺陷",
  },
  {
    value:"2",
    label:"严重缺陷",
  },
];
export const levelOptionsObj = arrToObj(levelOptions);

// 缺陷类型
export const typeOptions = [
  {
    value:"1",
    label:"螺栓丢失",
  },
  {
    value:"2",
    label:"线路本体/杆塔/塔材丢失",
  },
];
export const typeOptionsObj = arrToObj(typeOptions);

// 绑定状态
export const bindOptions = [
  {
    value:"un_bind",
    label:"未绑定",
  },
  {
    value:"finish_bind",
    label:"已绑定",
  },
];
export const bindOptionsObj = arrToObj(bindOptions);

// 识别状态
export const detectStatusList = [
  {
    value:"ready",
    label:"未识别",
  },
  {
    value:"finish",
    label:"已识别",
  },
];
export const detectStatusListObj = arrToObj(detectStatusList);

// 复核状态
export const reviewStatusList = [
  {
    value:"ready",
    label:"未复核",
  },
  {
    value:"finish",
    label:"已复核",
  },
];
export const reviewStatusListObj = arrToObj(reviewStatusList);
