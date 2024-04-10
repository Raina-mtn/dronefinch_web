<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑设备' : '添加设备'" width="500"  >
    <!-- 表单 -->
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px" class="form-content"
       label-suffix="：" v-loading="loading">
      <el-form-item label="设备名称" prop="partsName" >
        <el-input v-model="form.partsName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="所属线路" prop="belongLine" class="voltage-form-item">
        <el-select v-model="form.belongLine" placeholder="请选择" :fit-input-width="true" :teleported="true">
          <el-option v-for="item in belongLineList" :label="item.lineName" :value="item.lineId" :key="item.lineId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="杆塔号" prop="towerName" >
        <el-input v-model="form.towerName" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="设备类型" prop="partsType" class="voltage-form-item">
        <el-select v-model="form.partsType" placeholder="请选择" :fit-input-width="true" :teleported="true">
          <el-option v-for="item in equipmentTypeList" :label="item.name" :value="item.code" :key="item.code"/>
        </el-select>
      </el-form-item>
      <el-form-item label="识别类型" prop="detectType" class="voltage-form-item">
        <el-select v-model="form.detectType" placeholder="请选择" :fit-input-width="true" :teleported="true">
          <el-option v-for="item in identifyTypeList" :label="item.name" :value="item.code" :key="item.code"/>
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
import * as devicePartsApi from "@/api/interface/maintenance/device-parts";
import type { FormInstance, FormRules } from "element-plus";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";

interface Props {
  visible: boolean
  id?: string
}

interface RuleForm{
  partsName:string
  belongLine:string
  towerName:string
  partsType:string
  detectType:string
}

const app = getCurrentInstance()?.appContext.config.globalProperties;
const props = withDefaults(defineProps<Props>(), {
});
const emits = defineEmits(["onClose"]);
const useDictStore = dictStore();


const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
let belongLineList = ref([]);

const state:{
  dialogVisible:boolean
  form:RuleForm
} = reactive({
  dialogVisible: false, //弹窗内部控制显示隐藏
  form: {//表单
    partsName:"",
    belongLine:"", //所属线路
    towerName:"", //杆塔号
    partsType:"", //设备类型
    detectType:"", //识别类型
  },
});
let { dialogVisible, form } = toRefs(state);

// 表单规则
const rules = reactive<FormRules<RuleForm>>({
  partsName: [
    { required: true, message: "请输入", trigger: "change" },
  ],
  belongLine: [
    { required: true, message: "请选择", trigger: "change" },
  ],
  towerName: [
    { required: true, message: "请输入", trigger: "change" },
  ],
  partsType: [
    { required: true, message: "请选择", trigger: "change" },
  ],
  detectType: [
    { required: true, message: "请选择", trigger: "change" },
  ],
});


// 外部打开弹窗 控制内部变量显示
watch(() => props.visible, (val) => {
  if (val){
    initPage();
  }
  dialogVisible.value = val;
});

// 弹窗内部关闭弹窗 清空form 改变父值
watch(dialogVisible, (val) => {
  if (val) return;
  resetForm();
  emits("onClose");
});

// 是否编辑
const isEdit = computed(() => {
  return !!props.id;
});

//设备类型
const equipmentTypeList = computed(() => {
  return useDictStore.statusMapList[TotalDict.PARTS_TYPE] || [];
});

//设备类型
const identifyTypeList = computed(() => {
  return useDictStore.statusMapList[TotalDict.PARTS_DETECT_TYPE] || [];
});

// 弹窗打开初始化数据
const initPage = async () => {
  // 获取所属线路选项
  const {data:{list}} = await useDictStore.getPartsTypeList();
  belongLineList.value = list;
  // 获取设备类型选项
  useDictStore.getDictTree(TotalDict.PARTS_TYPE);
  // 获取识别类型选项
  useDictStore.getDictTree(TotalDict.PARTS_DETECT_TYPE);
  // 编辑情况下 获取详情回填
  props.id && getDetail();
};

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
    const func = props.id ? devicePartsApi.editDevice(props.id, params) : devicePartsApi.addDevice(params);
    const {status:{msg}} = await func;
    app?.$message.success(msg);
    emits("onClose", true);
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
    const {data} = await devicePartsApi.getdDeviceDetail(props.id);
    form.value = data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};


</script>
<style lang="scss" scoped>
@import './device-dialog.scss'
</style>