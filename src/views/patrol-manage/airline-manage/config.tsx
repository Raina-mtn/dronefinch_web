import { ColumnProps } from "@/components/ProTable/interface";
import {getAirportSelect} from "@/api/interface/patrol/airline";
import {getLineSelectList} from "@/api/interface/maintenance/line";

export const columns: ColumnProps[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "dataName",
    label: "航线名称",
    search: { el: "input", key: "dataName", props:{searchCol:1} },
  },
  {
    prop: "airportId",
    label: "机库",
    search: { el: "select", key: "airportId" },
    isFilterEnum:true,
    fieldNames:{
      label:"airportName",
      value:"id",
    }, 
    enum:async function (){
      const {data} = await getAirportSelect();
      return Promise.resolve({data:{list:data}});
    },
  },
  {
    prop: "lineId",
    label: "巡检线路",
    search: { el: "select", key: "lineId" },
    isFilterEnum:true,
    fieldNames:{
      label:"lineName",
      value:"lineId",
    }, 
    enum:async function (){
      const {data} = await getLineSelectList();
      return Promise.resolve({data:{list:data}});
    },
  },
  {
    prop: "dataTypeName",
    label: "航线类型",
  },
  {
    prop: "placeNum",
    label: "航点数量",
  },
  {
    prop: "actionNum",
    label: "设备点数量",
  },
  {
    prop: "wayDistance",
    label: "任务里程(m)",
  },
  {
    prop: "updateTime",
    label: "编辑时间",
  },
  { prop: "operation", label: "操作", fixed: "right", width: 400, align:"left" },
];