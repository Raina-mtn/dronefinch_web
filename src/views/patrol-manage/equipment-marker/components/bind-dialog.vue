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
      <el-button type="primary" class="relative -top-20px" @click="relieve">解除绑定</el-button>
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
import { ref } from "vue";
import {columns} from "./config";
import { getWaylineParts, getBindParts} from "@/api/interface/patrol/airline";
import ProTable from "@/components/ProTable/index.vue";
import {ElMessage} from "element-plus";
import { nextTick } from "vue";

const dialogVisible = ref(false);
const initParam = ref({}); // 参数
const proTableRef = ref();
const currentActionId = ref();//当前航点动作id
const emits = defineEmits(["getWayline"]);
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
const openDialog = ({partsId, id}) => {
  currentActionId.value = id;
  dialogVisible.value = true;
  nextTick(() => {
    proTableRef.value.setRadio(partsId);
  });
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
    actionId:currentActionId.value,
    partsId:proTableRef.value.radio,
  };
  getBindParts(params).then(() => {
    ElMessage.success("绑定成功!");
    emits("getWayline");
    closeDialog();
  });
};
const relieve = () => {
  proTableRef.value.setRadio("");
};
defineExpose({
  openDialog,
});
</script>

<style scoped>

</style>