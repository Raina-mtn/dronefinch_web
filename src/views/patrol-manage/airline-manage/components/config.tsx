import {getLineSelectList} from "@/api/interface/maintenance/line";
import {getAirportSelect} from "@/api/interface/patrol/airline";

import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
const useDictStore = dictStore();

export const formColumns = (validateFile) => [
  {
    el:"input",
    prop:"dataName",
    label:"航线名称",
    clearable:true,
    rules:[{required: true, message: "请输入航线名称", trigger: "blur"}],
    span:24,
  },
  {
    el:"select",
    prop:"lineId",
    label:"巡检线路",
    getList:async () => ((await getLineSelectList()).data),
    optionsKey:{
      label:"lineName",
      value:"lineId",
    },
    rules:[{required: true, message: "请选择巡检线路", trigger: "blur"}],
    clearable:true,
    span:24,
  },
  {
    el:"select",
    prop:"airportId",
    label:"执行机库",
    getList:async () => ((await getAirportSelect()).data),
    optionsKey:{
      label:"airportName",
      value:"id",
    },
    rules:[{required: true, message: "请选择执行机库", trigger: "blur"}],
    clearable:true,
    span:24,
  },
  {
    el:"select",
    prop:"dataType",
    label:"航线类型",
    getList:async () => await (useDictStore.statusMapList[TotalDict.WAYLINE_TYPE] || []),
    optionsKey:{
      label:"name",
      value:"code",
    },
    rules:[{required: true, message: "请选择航线类型", trigger: "blur"}],
    clearable:true,
    span:24,
  },
  {
    prop:"upload",
    label:"航线文件",
    rules:[{required: true, validator: validateFile, trigger: "blur"}],
    span:24,
  },
];