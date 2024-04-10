<template>
  <el-dialog v-model="dialogVisible" :title="`${isEdit?'编辑':'新增'}`" width="25%" @close="closeDialog">
    <Form
        ref="wform"
        :formData="formData"
        :columns="formColumns"
        labelWidth="100px"
      >
      <template #airLine>
        <el-select
          class="w-full"
          v-model="formData.wayId"
          filterable
          remote
          clearable
          placeholder="请选择"
          :remote-method="remoteMethod"
          @blur="validate"
        >
          <el-option
            v-for="item in airLineList"
            :key="item.id"
            :label="item.dataName"
            :value="item.id"
          />
        </el-select>
      </template>
      <template #executeType>
        <el-select v-model="formData.executeType" class="w-full" placeholder="请选择" @blur="validate" clearable>
          <el-option
            v-for="item in executeTypeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </template>
      <template #cycle>
        <div class="w-full">
          <div class="w-full">
            每<el-input-number class="w-[40%] mr-[5%] ml-[1%]" v-model="formData.cycleStep" :min="1" clearable controls-position="right" @blur="validate" />
            <el-select v-model="formData.cycleType" class="w-1/2" placeholder="请选择" @blur="validate" clearable>
              <el-option
                v-for="item in cycleTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </div>
          <el-select v-if="formData?.cycleType!=='day'" v-model="formData.cycleValues" class="w-full mt-16px" clearable placeholder="请选择" multiple  @blur="validate">
            <el-option
              v-for="item in dayOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </template>
      </Form>
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="closeDialog">关闭</el-button>
            <el-button type="primary" @click="submit">
              确定
            </el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted} from "vue";
import {manualColumns, timeColumns, cycleColumns} from "./config";
import {add, update, getWayline, getLineDetail} from "@/api/interface/patrol/plan";
import {weekOptions} from "@/utils/config.js";
import Form from "@/components/form/index.vue";

import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash-es";
const useDictStore = dictStore();

interface FormData {
  id: number;
  taskName: string;
  wayId: number;
  wayName: string;
  wayType: string;
  wayTypeName: string;
  airportId: number;
  airportName: string;
  lineId: number;
  lineName: string;
  responsibleBy: number;
  responsibleByName: string;
  executeType: string;
  executeTypeName: string;
  executeDay: string;
  executeTime: string;
  startDay: string;
  endDay: string;
  cycleStep: number;
  cycleType: string;
  cycleTypeName: string;
  cycleValues: string|string[];
  operater: string;
  taskTime: string;
  taskStatus: string;
  taskStatusName: string;
}
interface AirLineList {
  id: number;
  dataName: string;
}
const emits = defineEmits(["refresh"]);
const dialogVisible = ref(false);
const formData = ref<FormData>({} as FormData);
const isEdit = ref(false);
const wform = ref();
const airLineList = ref<AirLineList[]>([] as AirLineList[]);

//周期类型
const cycleTypeList = computed(() => {
  return useDictStore.statusMapList[TotalDict.TASK_PLAN_CYCLE_TYPE] || [];
});
//执行方式
const executeTypeList = computed(() => {
  return useDictStore.statusMapList[TotalDict.TASK_PLAN_EXECUTE_TYPE] || [];
});
// 日期
const dayOptions = computed(() => {
  if (formData.value.cycleType === "week"){
    return weekOptions;
  } else {
    const days = [] as {label:string, value:string}[];
    for (let i = 1;i < 32;i++){
      days.push({label:`${i}号`, value:String(i)});
    }
    return days;
  }
});
// 航线名称校验
const validateAirLine = (rule, value, callback) => {
  if (!formData.value.wayId){
    callback(new Error("请选择航线名称"));
  }
  callback();
};
// 周期校验
const validateCycle = (rule, value, callback) => {
  if (!formData.value.cycleStep){
    callback(new Error("请选择重复设置"));
  } else {
    if (formData.value.cycleType !== "day" && !formData.value.cycleValues.length) {
      callback(new Error("请选择重复设置"));
    }
    callback();
  }
};
const formColumns = computed(() => {
  if (formData.value.executeType === "cycle"){
    return cycleColumns(validateCycle, validateAirLine);
  } else if (formData.value.executeType === "timer"){
    return timeColumns(validateAirLine); 
  } else {
    return manualColumns(validateAirLine);
  }
});

// 执行机库 && 作业类型
watch(() => formData.value.wayId, async (newVal) => {
  if (newVal){
    const {data:{airportName, dataTypeName}} = await getLineDetail(newVal);
    formData.value.airport = airportName;
    formData.value.type = dataTypeName;
  }
});

// 表单重置
const resetForm = () => {
  if (!wform.value) return;
  formData.value = {} as FormData;
};
const openDialog = (edit, row = {} as FormData) => {
  dialogVisible.value = true;
  isEdit.value = edit;
  formData.value = cloneDeep(row);
  // 周期
  formData.value.cycleValues && (formData.value.cycleValues = formData.value.cycleValues.split(","));
};
const closeDialog = () => {
  wform.value.element.resetFields();
  dialogVisible.value = false;
  formData.value = {} as FormData;
  resetForm();
};

// 航线名称-模糊搜索
const remoteMethod = async (query: string) => {
  airLineList.value = (await getWayline({dataName:query})).data;
};
// 修改验证
const validate = () => {
  wform.value.element.validate();
};
// 提交
const submit = async () => {
  wform.value.element.validate(async (valid:boolean) => {
    if (valid){
      const api = isEdit.value ? update : add;
      formData.value.cycleValues && (formData.value.cycleValues = formData.value.cycleValues.join());
      formData.value.rangeDay && formData.value.rangeDay.length && (formData.value.startDay = formData.value.rangeDay[0]);
      formData.value.rangeDay && formData.value.rangeDay.length && (formData.value.endDay = formData.value.rangeDay[1]);
      try {
        await api(formData.value);
        ElMessage.success(isEdit.value ? "编辑成功！" : "新增成功！");
        closeDialog();
        emits("refresh");
      } catch (error) {
        console.log("error :>> ", error);
      }
    }
  });
};
// 弹窗打开初始化数据
const initPage = () => {
  // 周期类型
  useDictStore.getDictTree(TotalDict.TASK_PLAN_CYCLE_TYPE);
  // 执行方式
  useDictStore.getDictTree(TotalDict.TASK_PLAN_EXECUTE_TYPE);
  // 航线名称
  remoteMethod("");
};

onMounted(() => {
  initPage();
});
defineExpose({
  openDialog,
});
</script>

<style scoped>

</style>