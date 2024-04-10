
import { ColumnProps } from "@/components/ProTable/interface";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";

const useDictStore = dictStore();


export const columns: ColumnProps[] = [
  { prop: "index", label: "", width: 80 },
  {
    prop: "dataName",
    label: "名称",
    search: { el: "input", label:"机场名称" },
  },
  {
    prop: "deviceModel",
    label: "型号",
  },
  {
    prop: "deviceSn",
    label: "设备SN",
    search: { el: "input" },
  },
  {
    prop: "firmwareVersion",
    label: "固件版本",
  },
  {
    prop: "deviceStatus",
    label: "状态",
    search: { el: "select", key: "deviceStatus", label:"设备状态" },
    fieldNames:{
      label:"name",
      value:"code",
    }, 
    enum:function (){
      return useDictStore.getDictTree(TotalDict.AIRPORT_STATUS);
    },
  },
  {
    prop: "lastOnlineTime",
    label: "最近在线时间",
  },
  { prop: "operation", label: "操作", fixed: "right", width: 350 },
]; 

// 标定状态row的属性：class 操作栏按钮
export const statusMap = {
  0:{
    class:"wait",
    text:"待命中",
    operate:["warning", "remote", "edit", "delete"],
  },
  1:{
    class:"offline",
    text:"离线",
    operate:["warning", "remote", "edit", "delete"],
  },
};

export const statusButtonMap = {
  warning:{
    name:"告警信息",
    icon:"icon-xiangqing",
    func:"showWarning",
  },
  remote:{
    name:"远程调试",
    icon:"icon-yuanchengkongzhi",
    func:"jumpRemote",
  },
  edit:{
    name:"编辑",
    icon:"icon-bianji",
    class:"delete-button",
    func:"onEdit", 
  },
  delete:{
    name:"删除",
    icon:"icon-shanchu",
    class:"delete-button",
    func:"onDelete",
    needConfirm:true,
  },
};