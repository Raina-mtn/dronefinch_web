<template>
  <div>
    <div style="border-bottom: 1px solid #095CBD;" class="pb-12px mb-24px">
      <Form
        ref="wform"
        :formData="formData"
        :columns="formColumns"
        labelWidth="100px"
      >
      <template #btns>
        <div class="inline-block relative -right-20">
            <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
            <el-button :icon="Refresh" @click="reset">重置</el-button>
          </div>
      </template>
      <template #time>
        <el-date-picker
          v-model="timeData.time"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
        />
      </template>
      <template #timebtns>
        <el-button-group class="ml-4">
            <el-button type="primary" color="#1765E3" @click="shortcut('day')">近30天</el-button>
            <el-button type="primary" color="#1765E3" @click="shortcut('month')">近3月</el-button>
            <el-button type="primary" color="#1765E3" @click="shortcut('year')">近1年</el-button>
          </el-button-group>          
      </template>
      </Form>
    </div>
      <div class="mb-24px">
        <div class="before:content-DEFAULT before:rounded-4px before:inline-block before:w-4px before:h-20px before:bg-[#0AF0FD] before:mr-10px text-white text-16px flex items-center">
          告警趋势图
          <el-button link class="!text-[#0AF0FD] ml-16px" @click="isShowChart = !isShowChart">{{isShowChart?'隐藏':'显示'}}</el-button>
        </div>
        <div class="h-200px w-full" v-show="isShowChart">
          <chart :option="chartOption" />
        </div>
      </div>
      <div>
        <div class="before:content-DEFAULT before:rounded-4px before:inline-block before:w-4px before:h-20px before:bg-[#0AF0FD] before:mr-10px text-white text-16px flex items-center pb-16px">
          告警明细表
          <el-button link class="!text-[#0AF0FD] ml-16px" @click="isShowTable = !isShowTable">{{isShowTable?'隐藏':'显示'}}</el-button>
        </div>
        <Table
          v-show="isShowTable"
          :selection="false"
          :table-data="tableData"
          :stripe="false"
          :border="false"
          :columns="columns()"
          :page="formData.page"
          size="small"
          :total="total"
          style="height: calc(100% - 50px);"
          @pageChange="getList"
        />
      </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from "vue";
import { Refresh, Search } from "@element-plus/icons-vue";
import {formColumns, columns} from "./config";
import Form from "@/components/form/index.vue";
import Table from "@/components/table/index.vue";
import Chart from "@/components/Chart/Chart.vue";
import dayjs from "dayjs";
import { getAlarmDay, getAlarmList } from "@/api/interface";
import { onMounted } from "vue";

const wform = ref();
const timeData = ref({
  time:[dayjs().subtract(1, "year").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")],
});
const formData:any = ref({
  page: {
    // 当前页数
    pageIndex: 1,
    // 每页显示条数
    pageSize: 10,
    // 总条数
    // total:0
  },
}); 
const dayRef = ref([]);
const tableData = ref();
const total = ref(0);
let isShowChart = ref(true);
let isShowTable = ref(true);
//获取表格数据
const getList = async () => {
  const data = {
    "page.pageIndex":formData.value.page.pageIndex,
    "page.pageSize":formData.value.page.pageSize,
    ...formData.value,
  };
  delete data.page;
  const res = await getAlarmList(data);
  tableData.value = res.data.list;
  total.value = res.data.totalCount;
};
const getTime = async (startDay, endDay) => {
  const data = {
    startDay:startDay,
    endDay:endDay,
  };
  const res = await getAlarmDay(data);
  dayRef.value = res.data.map((item) => {
    return [item.dateValue, item.num];
  }); 
};
watch(timeData.value, (newValue, oldValue) => {
  const startDay = dayjs(newValue.time[1]).subtract(1, "year").format("YYYY-MM-DD");
  getTime(startDay, newValue.time[1]);
}, {
  immediate:true,
});
//搜索
const search = () => {
  formData.value.page.pageIndex = 1;
  formData.value.page.pageSize = 10;
  const {time:[startDay, endDay]} = timeData.value;
  // delete formData.value.startDay
  // delete formData.value.endDay
  // const startDay = dayjs(endDay).subtract(1, 'year').format('YYYY-MM-DD')
  console.log(startDay, endDay);
  Object.assign(formData.value, { startDay, endDay });
  getList();
};
//重置
const reset = () => {
  wform.value.element.resetFields();
  formData.value.page.pageIndex = 1;
  formData.value.page.pageSize = 10;
  timeData.value.time = [dayjs().subtract(1, "year").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")];
  delete formData.value.startDay;
  delete formData.value.endDay;
  getList();
};
onMounted(() => {

  getList();
});
// 快捷时间
const shortcut = (time) => {
  switch (time){
  case "day":
    timeData.value.time = [dayjs().subtract(1, "month").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")];
    break;
  case "month":
    timeData.value.time = [dayjs().subtract(3, "month").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")];
    break;
  case "year":
    timeData.value.time = [dayjs().subtract(1, "year").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")];
    break;
  }
};
// const formatter = (start,end,arr) => {
//   const startFormat = dayjs(start);
//   const endFormat = dayjs(end);

//   const dates = [];
//   let current = startFormat;
//   while (current.isBefore(endFormat)) {
//     dates.push(current.format('YYYY-MM-DD'));
//     current = current.add(1, 'day');
//   }
//   dates.push(endFormat.format('YYYY-MM-DD'));

//   const data = {};
//   dates.forEach(date => {
//     data[date] = 0;
//   });
//   arr.forEach(([date, value]) => {
//     if (dates.includes(date)) {
//       data[date] = value;
//     }
//   });
//   const dataArr = Object.entries(data);
//   dataArr.sort(([date1], [date2]) => {
//     return dayjs(date1).diff(dayjs(date2));
//   });
//   console.log('dataArr :>> ', dataArr);
//   return dataArr;
// };

const chartOption = computed(() => {
  const time  = timeData.value?.time ? timeData.value.time[1] : dayjs().format("YYYY-MM-DD");
  const option = {
    tooltip: {
      position: 'top',
    },
    visualMap: {
      min: 0,
      max: 1000,
      calculable: true,
      left: 'right',
      top:'middle',
      inRange: {
        // color: ["#1F3F94","#2454AB", "#2A6CC4", "#328DE6","#369EF8"],
        color: ["#2454AB", "#2A6CC4", "#328DE6","#369EF8"],
      },
      textStyle:{
        color:"white",
      },
    },
    calendar: [
      {
        range: [dayjs(time).subtract(1, "year").format("YYYY-MM-DD"), time],
        cellSize: ["auto", 20],
        right:80,
        top:20,
        dayLabel: {
          firstDay: 1, // 从周一开始
          nameMap:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
          color:'#FFFFFFCC',
          fontSize:14,
        },
        monthLabel:{
          position:'end',
          formatter: '{yyyy}-{MM}',
          color:'#FFFFFFCC',
          fontSize:14,
        },
        itemStyle: {
          borderColor: "#0B2363",
          borderWidth: 2,
          color:"#8fa2bd",
        },
        splitLine: {
          show: false,
        },
        yearLabel: { show: false },
      },
    ],
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      // data:  formatter('2016-01-02','2017-01-02',[
      //   ['2016-05-02',12],
      //   ['2016-05-03',615],
      //   ['2016-05-04',58],
      //   ['2016-06-05',25],
      //   ['2016-05-06',522],
      // ]),
      data:dayRef.value,
    },
  };
  return option;

});
</script>

<style scoped>

</style>