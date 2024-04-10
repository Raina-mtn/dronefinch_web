import { ColumnProps } from "@/components/ProTable/interface";
import { useRouter } from "vue-router";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
import { getLineSelectList } from "@/api/interface/maintenance/line";
const useDictStore = dictStore();

export const formColumns : any[] = [
  {
    label: "线路",
    el: "select",
    prop:"lineId",
    optionsKey:{
      label:"lineName",
      value:"lineId",
    },
    getList:async () => ((await getLineSelectList()).data),
    // getList:async () => ((await apiGetDetectionList({page:{pageIndex:1,pageSize:100}})).list),
    span:5,
  },
  {
    label: "杆塔号",
    el: "input",
    prop:"towerName",
    span:5,
  },
  {
    label: "设备类型",
    el: "select",
    prop:"partsType",
    optionsKey:{
      label:"name",
      value:"code",
    },
    getList:async () => ((await useDictStore.getDictTree(TotalDict.PARTS_TYPE)).data.list),
    span:5,
  },
  {
    label: "设备名称",
    el: "input",
    prop:"partsName",
    span:5,
  },
  {
    prop: "btns",
    label: "",
    span:4,
  },
  {
    label: "选择日期",
    prop:"time",
    span:6,
  },
  {
    prop: "timebtns",
    label: "",
    span:6,
  },
];

export const columns: (()=>ColumnProps[]) = () => [
  {
    prop: "partsName",
    label: "设备名称",
  },
  {
    prop: "partsTypeName",
    label: "设备类型",
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
    prop: "defectLevelName",
    label: "缺陷等级",
  },
  {
    prop: "defectTypeName",
    label: "缺陷类型",
  },
  {
    prop: "detectTime",
    label: "检测时间",
  },
  {
    label: "操作",
    fixed: "right",
    width: 400,
    render ({row}:{row:any}) {
      const router = useRouter();
      return <el-button style="color:#0AF0FD;" link onClick={() => {
        router.push({ path: "/home/data-analyse/image-marker", query: { id: row.id }});
      }}><i class="iconfont icon-tupian mr-5px"></i>检测图片</el-button>;
    },
  },
];