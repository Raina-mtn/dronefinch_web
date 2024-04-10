<template>
  <el-dialog v-model="dialogVisible" title="绑定设备点" @close="closeDialog">
    <ProTable
    ref="proTableRef" 
    :columns="columns" 
    max-height="680" 
    :initParam="initParam" 
    :request-api="(params) => getList(params)"
    :searchToolButton="false"
    >
    </ProTable>
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
import { ref, getCurrentInstance } from "vue";
import {columns} from "./config";
import { getWaylineParts} from "@/api/interface/patrol/airline";
import { getImageBind} from "@/api/interface/patrol/audit";
import ProTable from "@/components/ProTable/index.vue";
import {ElMessage} from "element-plus";
import {CurrenCheck} from "../../../interface";

interface Props{
  currenCheck:CurrenCheck
}
const props = defineProps<Props>();

const dialogVisible = ref(false);
const initParam = ref({}); // 参数
const proTableRef = ref();
const currentActionId = ref();//当前航点动作id

// 在setup函数中获取实例对象并定义bus
const instance = getCurrentInstance();
const bus = instance?.appContext.config.globalProperties.$bus;

// 获取列表
const getList = (params) => {
  const data = {
    "page.pageIndex":params.page.pageIndex,
    "page.pageSize":params.page.pageSize,
    ...params,
  };
  delete data.page;
  return getWaylineParts(data);
};
// 表单重置
const resetForm = () => {
  if (!proTableRef.value) return;
  proTableRef.value.reset();
};
//打开弹窗调用
const openDialog = (actionId) => {
  currentActionId.value = actionId;
  dialogVisible.value = true;
};
//关闭弹窗调用
const closeDialog = () => {
  dialogVisible.value = false;
  resetForm();
  proTableRef.value.clearRadio();
};
//提交绑定
const submit = () => {
  const params = {
    id:props.currenCheck.id,
    partsId:proTableRef.value.radio,
  };
  getImageBind(params).then(() => {
    ElMessage.success("绑定成功!");
    bus.emit("getList");
    closeDialog();
  });
};
defineExpose({
  openDialog,
});
</script>

<style scoped>

</style>