<template>
  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑线路' : '新增线路'" width="500"  >
    <!-- 表单 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="form-content"
       label-suffix="：" v-loading="loading">
      <el-form-item label="线路名称" prop="lineName" >
        <el-input v-model="form.lineName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="线路长度" prop="lineDistance" class="length-form-item">
        <el-input-number
          v-model="form.lineDistance"
          :min="0"
          controls-position="right"
        />
        <span class="ml-2 text-sm">KM</span>
      </el-form-item>
      <el-form-item label="电压等级" prop="voltageLevel" class="voltage-form-item">
        <el-select v-model="form.voltageLevel" placeholder="请选择" :fit-input-width="true" :teleported="false">
          <el-option v-for="item in voltageList" :label="item.name" :value="item.code" :key="item.code"/>
        </el-select>
      </el-form-item>
      <el-form-item label="省市区" prop="district" class="city-form-item">
        <el-cascader ref="cityRef" :options="regionData" :props="cityProps" v-model="form.district" @change="changeCity"/>
      </el-form-item>
      <el-form-item label="负责人" prop="responsibleBy" >
        <el-input v-model="form.responsibleBy" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="telPhone" >
        <el-input v-model="form.telPhone" placeholder="请输入"/>
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
import { ref, reactive, computed, watch, toRefs, getCurrentInstance, Ref } from "vue";
import * as lineManageApi from "@/api/interface/maintenance/line";
import type { CascaderInstance, FormInstance, FormRules } from "element-plus";
import regionData from "@/assets/area.js";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
import {last} from "lodash";
import {checkPhone} from "../../config";

interface Props {
  visible: boolean
  id?: number | string
}

interface RuleForm{
  lineName:string
  lineDistance:number
  voltageLevel:string
  district:string | (string | number)[]
  responsibleBy:string
  telPhone:string
  districtName:string
}

const app = getCurrentInstance()?.appContext.config.globalProperties;
const useDictStore = dictStore();
const props = withDefaults(defineProps<Props>(), {
});
const emits = defineEmits(["onClose"]);

const loading = ref(false);
const formRef = ref<FormInstance>();
const cityProps = {
  label:"name",
  value:"code",
};
const cityRef = ref();

const state:{
  dialogVisible:boolean
  form:RuleForm
} = reactive({
  dialogVisible: false, //弹窗内部控制显示隐藏
  form: {//表单
    lineName:"",
    lineDistance:0,
    voltageLevel:"",
    district:"",
    responsibleBy:"",
    telPhone:"",
    districtName:"",
  },
});
let { dialogVisible, form } = toRefs(state);

// 表单规则
const rules = reactive<FormRules<RuleForm>>({
  lineName: [
    { required: true, message: "请输入", trigger: "change" },
  ],
  lineDistance: [
    { required: true, message: "请输入", trigger: "change" },
  ],
  voltageLevel: [
    { required: true, message: "请输入", trigger: "change" },
  ],
  district: [
    { required: true, message: "请输入", trigger: "change" },
  ],
  responsibleBy: [
    { required: true, message: "请输入", trigger: "change" },
  ],
  telPhone: [
    { validator: checkPhone, trigger: "change" },
  ],
});

//电压等级
const voltageList = computed(() => {
  return useDictStore.statusMapList[TotalDict.VOLTAGE_LEVEL];
});


// 外部打开弹窗 控制内部变量显示
watch(() => props.visible, (val) => {
  // 编辑情况下 获取详情回填
  if (val && props.id){
    getDetail();
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

// 提交表单
const onSubmit = async () => {
  if (!formRef.value || loading.value) return;
  loading.value = true;
  try {
    const valid = await formRef.value.validate();
    if (!valid) return;
    const params = {
      ...form.value,
      district:last(form.value.district),
    };
    const func = props.id ? lineManageApi.editRoute(props.id, params) : lineManageApi.addRoute(params);
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
  if (!formRef.value) return;
  formRef.value.resetFields();
};

// 获取详情回填
const getDetail = async () => {
  loading.value = true;
  try {
    const {data, status:{msg}} = await lineManageApi.getLineDetail(props.id);
    form.value = data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// 设置选择省市区的label
const changeCity = () => {
  form.value.districtName = cityRef.value.getCheckedNodes(false)[0].pathLabels.join("-");
};

</script>
<style lang="scss" scoped>
@import './route-dialog.scss'
</style>