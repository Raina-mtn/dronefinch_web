
import { ColumnProps } from "@/components/ProTable/interface";
import * as routeManageApi from "@/api/interface/maintenance/line";
import regionData from "@/assets/area.js";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";

const useDictStore = dictStore();


export const columns: ColumnProps[] = [
  { type: "index", label: "序号", width: 80 },
  {
    prop: "lineName",
    label: "线路名称",
    search: { el: "input", key: "lineName" },
  },
  {
    prop: "lineDistance",
    label: "线路长度",
  },
  {
    prop: "voltageLevel",
    label: "电压等级",
    search: { el: "select", key: "voltageLevel" },
    isFilterEnum:true,
    fieldNames:{
      label:"name",
      value:"code",
    }, 
    enum:function (){
      return useDictStore.getDictTree(TotalDict.VOLTAGE_LEVEL);
    },
  },
  {
    prop: "districtName",
    label: "省市区",
    enum:regionData,
    fieldNames:{
      label:"name",
      value:"code",
      children:"children",
    },
    isFilterEnum:false,
    search: {
      el: "cascader",
      key:"district",
      props: {
        props:{
          key:"district",
        },
      },
    },
  },
  {
    prop: "partsNum",
    label: "巡检设备",
  },
  {
    prop: "lastPatrolTime",
    label: "最近巡检",
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 },
]; 

export const checkPhone = (_rule: any, value: any, callback: any) => {
  const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
  if (!value) {
    return callback(new Error("电话号码不能为空"));
  }
  setTimeout(() => {
    // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
    // 所以在前面加了一个+实现隐式转换

    if (!Number.isInteger(+value)) {
      callback(new Error("请输入数字值"));
    } else {
      if (phoneReg.test(value)) {
        callback();
      } else {
        callback(new Error("电话号码格式不正确"));
      }
    }
  }, 100);
};