import { ColumnProps } from "@/components/ProTable/interface";
import {executeStatus} from "@/utils/enum/taskRecordEnum";
import {getAirportSelect} from "@/api/interface/patrol/airline";
import {getLineSelectList} from "@/api/interface/maintenance/line";

export const columns: ColumnProps[] = (lineName) => [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "taskName",
    label: "任务名称",
  },
  {
    prop: "wayName",
    label: "航线名称",
    search: { el: "input", key: "wayId", defaultValue:lineName},
  },
  {
    prop: "airportId",
    label: "机库",
    search: { el: "select", key: "airport" },
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
    prop: "wayTypeName",
    label: "作业类型",
  },
  {
    prop: "executeTypeName",
    label: "执行方式",
  },
  {
    prop: "responsibleBy",
    label: "责任人",
  },
  {
    prop: "taskTime",
    label: "任务时间",
  },
  {
    prop: "taskStatusName",
    label: "任务状态",
    render:  ({ row }) => {
      return (<span style={{"color":executeStatus[row.taskStatus].color ?? "#fff"}} > {row.taskStatusName}</span>);
    },
  },
  { prop: "operation", label: "操作", fixed: "right", width: 400, align:"left" },
];