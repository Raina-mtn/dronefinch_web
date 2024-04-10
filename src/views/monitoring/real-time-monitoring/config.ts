
import { ColumnProps } from "@/components/ProTable/interface";
export const columns: ColumnProps[] = [
  { prop: "alarmDeviceName",label: "告警设备" },
  { prop: "alarmContent",label: "告警内容", width: 160 },
  {
    prop: "alarmLevelName",
    label: "告警等级",
  },
  {
    prop: "alarmCode",
    label: "错误码",
  },
  { prop: "alarmTime", label: "开始时间"},
]; 