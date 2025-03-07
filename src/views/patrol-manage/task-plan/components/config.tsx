import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
const useDictStore = dictStore();

export const manualColumns = (validateAirLine) => [
  {
    el:"input",
    prop:"taskName",
    label:"任务名称",
    clearable:true,
    rules:[{required: true, message: "请输入任务名称", trigger: "blur"}],
    span:24,
  },
  {
    prop:"airLine",
    label:"航线名称",
    rules:[{required: true, validator: validateAirLine, trigger: "blur"}],
    span:24,
  },
  {
    el:"input",
    prop:"airport",
    label:"执行机库",
    disabled:true,
    placeholder:"",
    span:24,
  },
  {
    el:"input",
    prop:"type",
    label:"作业类型",
    disabled:true,
    placeholder:"",
    span:24,
  },
  {
    el:"input",
    prop:"responsibleBy",
    label:"负责人",
    // getList:async () => ((await apiGetTaskOffList({page:{pageIndex:1, pageSize:100}})).list),
    // optionsKey:{
    //   label:"name",
    //   value:"name",
    // },
    clearable:true,
    rules:[{required: true, message: "请输入负责人", trigger: "blur"}],
    span:24,
  },
  {
    // el:"select",
    prop:"executeType",
    label:"执行方式",
    // getList:async () => useDictStore.statusMapList[TotalDict.TASK_PLAN_EXECUTE_TYPE] || [],
    // optionsKey:{
    //   label:"name",
    //   value:"code",
    // },
    // clearable:true,
    rules:[{required: true, message: "请选择执行方式", trigger: "blur"}],
    span:24,
  },
];

export const timeColumns = (validateAirLine) => [
  {
    el:"input",
    prop:"taskName",
    label:"任务名称",
    clearable:true,
    rules:[{required: true, message: "请输入任务名称", trigger: "blur"}],
    span:24,
  },
  {
    prop:"airLine",
    label:"航线名称",
    rules:[{required: true, validator: validateAirLine, trigger: "blur"}],
    span:24,
  },
  {
    el:"input",
    prop:"airport",
    label:"执行机库",
    disabled:true,
    placeholder:"",
    span:24,
  },
  {
    el:"input",
    prop:"type",
    label:"作业类型",
    disabled:true,
    placeholder:"",
    span:24,
  },
  {
    el:"input",
    prop:"responsibleBy",
    label:"负责人",
    // getList:async () => ((await apiGetTaskOffList({page:{pageIndex:1, pageSize:100}})).list),
    // optionsKey:{
    //   label:"name",
    //   value:"name",
    // },
    clearable:true,
    rules:[{required: true, message: "请输入负责人", trigger: "blur"}],
    span:24,
  },
  {
    el:"select",
    prop:"executeType",
    label:"执行方式",
    getList:async () => useDictStore.statusMapList[TotalDict.TASK_PLAN_EXECUTE_TYPE] || [],
    optionsKey:{
      label:"name",
      value:"code",
    },
    clearable:true,
    rules:[{required: true, message: "请选择执行方式", trigger: "blur"}],
    span:24,
  },
  {
    el:"date-picker",
    prop:"executeDay",
    label:"执行日期",
    clearable:true,
    "disabled-date":(day) => {
      return day.getTime() < new Date().getTime() - 86400000;
    }, 
    rules:[{required: true, message: "请选择执行日期", trigger: "blur"}],
    span:24,
  },
  {
    el:"time-picker",
    prop:"executeTime",
    label:"执行时间",
    clearable:true,
    rules:[{required: true, message: "请选择执行时间", trigger: "blur"}],
    span:24,
  },
];

export const cycleColumns = (validateCycle, validateAirLine) => [
  {
    el:"input",
    prop:"taskName",
    label:"任务名称",
    clearable:true,
    rules:[{required: true, message: "请输入任务名称", trigger: "blur"}],
    span:24,
  },
  {
    prop:"airLine",
    label:"航线名称",
    rules:[{required: true, validator: validateAirLine, trigger: "blur"}],
    span:24,
  },
  {
    el:"input",
    prop:"airport",
    label:"执行机库",
    disabled:true,
    placeholder:"",
    span:24,
  },
  {
    el:"input",
    prop:"type",
    label:"作业类型",
    disabled:true,
    placeholder:"",
    span:24,
  },
  {
    el:"input",
    prop:"responsibleBy",
    label:"负责人",
    // getList:async () => ((await apiGetTaskOffList({page:{pageIndex:1, pageSize:100}})).list),
    // optionsKey:{
    //   label:"name",
    //   value:"name",
    // },
    clearable:true,
    rules:[{required: true, message: "请输入负责人", trigger: "blur"}],
    span:24,
  },
  {
    el:"select",
    prop:"executeType",
    label:"执行方式",
    getList:async () => useDictStore.statusMapList[TotalDict.TASK_PLAN_EXECUTE_TYPE] || [],
    optionsKey:{
      label:"name",
      value:"code",
    },
    clearable:true,
    rules:[{required: true, message: "请选择执行方式", trigger: "blur"}],
    span:24,
  },
  {
    el:"date-picker",
    prop:"rangeDay",
    type:"daterange",
    label:"起止日期",
    clearable:true,
    rules:[{required: true, message: "请选择起止日期", trigger: "blur"}],
    span:24,
  },
  {
    el:"time-picker",
    prop:"executeTime",
    label:"执行时间",
    clearable:true,
    rules:[{required: true, message: "请选择执行时间", trigger: "blur"}],
    span:24,
  },
  {
    prop:"cycle",
    label:"重复设置",
    rules:[{ validator: validateCycle, trigger: "blur" }],
    span:24,
  },
];