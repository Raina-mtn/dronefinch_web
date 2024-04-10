import { ColumnProps } from "@/components/ProTable/interface";
import {getLineSelectList} from "@/api/interface/maintenance/line";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
const useDictStore = dictStore();

export const columns: ColumnProps[] = [
  { type: "radio", width: 80 },
  {
    prop: "lineName",
    label: "线路名称",
    isShow:false,
    search: { el: "select", key: "lineName", order:1},
    isFilterEnum:true,
    fieldNames:{
      label:"lineName",
      value:"lineName",
    }, 
    enum:async function (){
      const {data} = await getLineSelectList();
      return Promise.resolve({data:{list:data}});
    },
  },
  {
    prop: "partsName",
    label: "设备名称",
    search: { el: "input", key: "partsName", order:3},
  },
  {
    prop: "partsType",
    label: "设备类型",
    search: { el: "select", key: "partsType", order:4},
    isFilterEnum:true,
    fieldNames:{
      label:"name",
      value:"code",
    }, 
    enum:async function (){
      const partsType = (await useDictStore.getDictTree(TotalDict.PARTS_TYPE)).data;
      return Promise.resolve({data:partsType}) ;
    },
  },
  {
    prop: "belongLineName",
    label: "所属线路",
  },
  {
    prop: "towerName",
    label: "杆塔号",
    search: { el: "input", key: "towerName", order:2},
  },
  {
    prop: "detectType",
    search: { el: "select", key: "detectType", order:5},
    label: "识别类型",
    isFilterEnum:true,
    fieldNames:{
      label:"name",
      value:"code",
    }, 
    enum:async function (){
      const partsType = (await useDictStore.getDictTree(TotalDict.PARTS_DETECT_TYPE)).data;
      return Promise.resolve({data:partsType}) ;
    },
  },
];