import { ColumnProps } from "@/components/ProTable/interface";
import {getLineSelectList} from "@/api/interface/maintenance/line";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
const useDictStore = dictStore();

export const columns: ColumnProps[] = [
  { type: "radio", width: 80 },
  {
    label: "线路名称",
    isShow:false,
    search: { el: "select", key: "lineName", order:1},    
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
    prop: "partsName",
    label: "设备名称",
    search: { el: "input", key: "partsName", order:3},
  },
  {
    prop: "partsTypeName",
    label: "设备类型",
    search: { el: "select", key: "partsType", order:4},
    isFilterEnum:true,
    fieldNames:{
      label:"name",
      value:"code",
    }, 
    enum:async function (){
      const partsType = (await useDictStore.getDictTree(TotalDict.PARTS_TYPE)).data.list;
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
    prop: "detectTypeName",
    search: { el: "select", key: "detectType", order:5},
    label: "识别类型",
    isFilterEnum:true,
    fieldNames:{
      label:"name",
      value:"code",
    }, 
    enum:async function (){
      const partsType = (await useDictStore.getDictTree(TotalDict.PARTS_DETECT_TYPE)).data.list;
      return Promise.resolve({data:partsType}) ;
    },
  },
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
export const checkEmail = (_rule: any, value: any, callback: any) => {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

  setTimeout(() => {
    if (!value || mailReg.test(value)) {
      callback();
    } else {
      callback(new Error("请输入正确的邮箱格式"));
    }
  }, 100);
};


