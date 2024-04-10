<template>
  <el-dialog v-model="dialogVisible" :title="`${isEdit?'编辑航线':'导入航线'}`" width="25%" @close="closeDialog">
    <Form
      ref="wform"
      :formData="formData"
      :columns="formColumns(validateFile)"
      labelWidth="100px"
      v-loading="loading"
    >
      <template #upload>
        <div v-if="isEdit" class="w-full flex items-center justify-between px-16px">
          <span>{{ formData.fileName }}</span>
        </div>
        <FileUpload v-else class="w-full" v-model="file" :limit="1" :accept="'.kmz'" tips="支持扩展名：.kmz" @blur="validateFile" />
      </template>
      </Form>
    <template #footer>
      <el-button @click="closeDialog">关闭</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref} from "vue";
import {formColumns} from "./config";
import {add, update} from "@/api/interface/patrol/airline";
import { cloneDeep } from "lodash-es";
import { ElMessage } from "element-plus";
import Form from "@/components/form/index.vue";
import FileUpload from "@/components/Upload/fileUpload.vue";

interface FormData {
  dataName: string;
  fileName: string;
  dataType: string;
  lineId: number;
  airportId: number;
  fileKey: FileList;
}
interface FileList{
  id:string
  showName:string
}

const wform = ref();
const dialogVisible = ref(false);
let formData = ref<FormData>({} as FormData);
const isEdit = ref(false);
const loading = ref(false);
const file = ref();

const emits = defineEmits(["refresh"]);

// 表单重置
const resetForm = () => {
  if (!wform.value) return;
  formData.value = {} as FormData;
  file.value = null;
};

const openDialog = async (edit, row) => {
  dialogVisible.value = true;
  isEdit.value = edit;
  if (row) formData.value = cloneDeep(row);
};
const closeDialog = () => {
  wform.value.element.resetFields();
  dialogVisible.value = false;
  resetForm();
};
// 文件校验

//表单校验
const validateFile = (rule: any, value: any, callback: any) => {
  if (isEdit.value || (file.value && file.value.key)) {
    return callback();
  } else {
    callback(new Error("请选择文件"));
  }
};
// 提交
const submit = async () => {
  await wform.value.element.validate(async (valid:boolean) => { 
    if (valid) {
      //新增
      if (!isEdit.value){
        formData.value.fileKey = file.value?.key ?? "";
        try {
          await add(formData.value);
          closeDialog();
          ElMessage.success("导入成功！");
          emits("refresh");
        } catch (error) {
          console.log("error :>> ", error);
        }
      } else {
        try {
          await update(formData.value);
          closeDialog();
          ElMessage.success("更新成功！");
          emits("refresh");
        } catch (error) {
          console.log("error :>> ", error);
        }
      }
    }
  });
};
defineExpose({
  openDialog,
});
</script>

<style scoped>

</style>