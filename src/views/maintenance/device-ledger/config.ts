
import { ColumnProps } from "@/components/ProTable/interface";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
import {getLineList} from "@/api/interface/maintenance/device-parts";


const useDictStore = dictStore();

export const columns: ColumnProps[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "partsName",
    label: "设备名称",
    search: { el: "input", key: "partsName" },
  },
  {
    prop: "partsType",
    label: "设备类型",
    search: { el: "select", key: "partsType" },
    fieldNames:{
      label:"name",
      value:"code",
    }, 
    enum:function (){
      return useDictStore.getDictTree(TotalDict.PARTS_TYPE);
    },
  },
  {
    prop: "belongLineName",
    label: "所属线路",
    search: { el: "select", key: "lineName", label:"线路名称" },
    fieldNames:{
      label:"lineName",
      value:"lineName",
    }, 
    enum:function (){
      return useDictStore.getPartsTypeList();
    },
  },
  {
    prop: "towerName",
    label: "杆塔号",
  },
  {
    prop: "detectTypeName",
    label: "识别类型",
  },
  {
    prop: "markStatusName",
    label: "标定状态",
  },
  {
    prop: "lastDetectTime", 
    label: "最近检测",
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 },
]; 

// 标定状态row的属性：class 操作栏按钮
export const denarcateStatus = {
  finish:{
    class:"over",
    text:"已标定",
    operate:["edit", "delete"],
  },
  ready:{
    class:"wait",
    text:"未标定",
    operate:["edit", "delete"],
  },
};

export const denarcateButtonMap = {
  record:{
    name:"巡检记录",
    icon:"icon-xiangqing",
    func:"jumpRecord",
  },
  edit:{
    name:"编辑",
    icon:"icon-bianji",
    func:"editDevice",
  },
  delete:{
    name:"删除",
    icon:"icon-shanchu",
    class:"delete-button",
    func:"onDelete",
    needConfirm:true,
  },
};