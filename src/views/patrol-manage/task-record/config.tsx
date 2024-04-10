import { ColumnProps } from "@/components/ProTable/interface";
import {taskStatus} from "@/utils/enum/taskRecordEnum";
import {getAirportSelect} from "@/api/interface/patrol/airline";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
const useDictStore = dictStore();

export const columns: (taskName:string)=>ColumnProps[] = (taskName) => [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "taskCode",
    label: "任务编号",
  },
  {
    prop: "taskName",
    label: "任务名称",
    search: { el: "input", key: "taskName", defaultValue:taskName},
  },
  {
    prop: "taskType",
    label: "任务类型",
    search: { el: "select", key: "taskType" },
    fieldNames:{
      label:"name",
      value:"code",
    }, 
    enum:function (){
      return useDictStore.getDictTree(TotalDict.TASK_RECORD_TYPE);
    },
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
    prop: "wayName",
    label: "航线名称",
    search: { el: "input", key: "wayId" },
  },
  {
    prop: "startTime",
    label: "开始时间",
    search: { 
      el: "date-picker",
      props: {
        type: "daterange",
        "value-format": "YYYY-MM-DD HH:mm:ss",
      },
    },
  },
  {
    prop: "endTime",
    label: "结束时间",
  },
  {
    prop: "detectProgress",
    label: "识别进度",
    render: ({ row }) => {
      return (<el-progress color={row.detectProgress === 100 ? "#69EF00" : "#369EF8"} percentage={row.detectProgress} />);
    },
  },
  {
    prop: "taskStatusName",
    label: "任务状态",
    render: ({ row }) => {
      return (<span style={{"color":taskStatus[row.taskStatus].color ?? "#fff"}} > {row.taskStatusName}</span>);
      // return (<span> {row.taskStatusName}</span>);
    },
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330, align:"left" },
];

