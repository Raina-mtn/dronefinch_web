<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑机场' : '新增机场'" width="500"  >
    <!-- 表单 -->
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px" class="form-content"
       label-suffix="：" v-loading="loading">
      <el-form-item label="机场名称" prop="dataName" >
        <el-input v-model="form.dataName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="型号" prop="deviceModel" class="voltage-form-item">
        <el-select v-model="form.deviceModel" placeholder="请选择" :fit-input-width="true" :teleported="true">
          <el-option v-for="item in modelList" :label="item.name" :value="item.code" :key="item.code"/>
        </el-select>
      </el-form-item>
      <el-form-item label="设备SN" prop="deviceSn" >
        <el-input v-model="form.deviceSn" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="固件版本" prop="firmwareVersion" >
        <el-input v-model="form.firmwareVersion" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="飞行器名称" prop="belongDrone" class="voltage-form-item">
        <el-select v-model="form.belongDrone" placeholder="请选择" :fit-input-width="true" :teleported="true">
          <el-option v-for="item in aircraftList" :label="item.dataName" :value="item.id" :key="item.id"/>
        </el-select>
      </el-form-item>
      
    </el-form>
    <!-- footer -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, toRefs, getCurrentInstance } from "vue";
import type { Ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";

import * as airportManageApi from "@/api/interface/equipment-manage/airport";
import * as droneApi from "@/api/interface/equipment-manage/drone";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";

interface Props {
}

interface RuleForm{
  dataName:string
  deviceModel:string
  deviceSn:string
  firmwareVersion:string
  belongDrone:string
}

const app = getCurrentInstance()?.appContext.config.globalProperties;
const useDictStore = dictStore();
const emits = defineEmits(["refresh"]);

const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const aircraftList:Ref<any[]> = ref([]); //飞行器list
let selectId = "";


const state:{
  dialogVisible:boolean
  form:RuleForm
} = reactive({
  dialogVisible: false, //弹窗内部控制显示隐藏
  form: {//表单
    dataName:"",
    deviceModel:"",
    deviceSn:"",
    firmwareVersion:"",
    belongDrone:"",
  },
});
let { dialogVisible, form } = toRefs(state);

// 表单规则
const rules = reactive<FormRules<RuleForm>>({
  dataName: [
    { required: true, message: "请输入", trigger: "change" },
  ],
  deviceModel: [
    { required: true, message: "请选择", trigger: "change" },
  ],
  deviceSn: [
    { required: true, message: "请输入", trigger: "change" },
  ],
  firmwareVersion: [
    { required: true, message: "请输入", trigger: "change" },
  ],
  belongDrone: [
    { required: true, message: "请选择", trigger: "change" },
  ],
});

// 弹窗内部关闭弹窗 清空form 改变父值
watch(dialogVisible, (val) => {
  if (val) return;
  resetForm();
});

// 打开弹窗 - 暴露出去的方法
const openDialog = async ({id} = {id:""}) => {
  // 编辑还是新增赋值选中id
  selectId = id ?? "";
  // 打开弹窗的数据初始化
  initData();
  dialogVisible.value = true;
};

// 是否编辑
const isEdit = computed(() => {
  return !!selectId;
});

//机场型号
const modelList = computed(() => {
  return useDictStore.statusMapList[TotalDict.AIRPORT_MODEL] || [];
});

// 提交表单
const onSubmit = async () => {
  if (!ruleFormRef.value || loading.value) return;
  loading.value = true;
  try {
    const valid = await ruleFormRef.value.validate();
    if (!valid) return;
    
    const params = {
      ...form.value,
    };
    const func = selectId ? airportManageApi.editRecord(selectId, params) : airportManageApi.addRecord(params);
    const {status:{msg}} = await func;
    app?.$message.success(msg);
    dialogVisible.value = false;
    emits("refresh");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// 表单重置
const resetForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();
};

// 获取详情回填
const getDetail = async () => {
  loading.value = true;
  try {
    const {data} = await airportManageApi.getAirportInfo(selectId);
    form.value = data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
  
};

// 打开弹窗的数据初始化
const initData = async () => {
  // 获取机场型号字典
  useDictStore.getDictTree(TotalDict.AIRPORT_MODEL);
  // 编辑情况下 获取详情回填
  selectId && await getDetail();
  // 获取未绑定飞行器列表
  getDroneUnbindList();
};

// 获取未绑定飞行器列表
const getDroneUnbindList = async () => {
  const params = {
    droneId:form.value.belongDrone || "",
  };
  const {data} = await droneApi.getUnbindDronList(params);
  aircraftList.value = data;
};

defineExpose({
  openDialog,
});
</script>
<style lang="scss" scoped>
@import './airport-dialog.scss'
</style>