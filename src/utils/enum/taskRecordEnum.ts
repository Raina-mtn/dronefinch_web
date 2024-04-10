// 任务记录-任务状态
export const taskStatus = {
  "ready":{
    label:"准备中",
    color:"#03C7FF",
    operation:[],
  },
  "detect":{
    label:"识别中",
    color:"#03C7FF",
    operation:["result", "back", "report"],
  },
  "review":{
    label:"待审核",
    color:"#FF906E",
    operation:["audit", "result", "back"],
  },
  "patrol":{
    label:"巡检中",
    color:"#FFFA00",
    operation:["monitor", "finish"],
  },
  "finish":{
    label:"已完成",
    color:"#69EF00",
    operation:["report", "result", "back"],
  },
  "fail":{
    label:"失败",
    color:"#f92d1d",
    operation:[],
  },
  "cancel":{
    label:"已取消",
    color:"#C0F1FF",
    operation:[],
  },
};

// 任务计划-任务状态
export const executeStatus = {
  "ready":{
    label:"待执行",
    color:"#03C7FF",
    operation:["execute", "record", "edit", "delete"],
  },
  "finish":{
    label:"已执行",
    color:"#69EF00",
    operation:["record"],
  },
};