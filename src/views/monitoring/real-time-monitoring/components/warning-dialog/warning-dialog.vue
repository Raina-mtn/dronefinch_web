<template>
    <el-dialog v-model="dialogVisible" title="告警信息">
        <ProTable ref="proTableRef" title="告警信息" :initParam="initParam"  :columns="columns" :request-api="getList" >    
        </ProTable>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { columns } from "../../config";
import {getWarningList} from "@/api/interface/equipment-manage/airport";


let initParam = reactive({
  airport:"",
});

const state = reactive({
  dialogVisible: false,
});
let { dialogVisible } = toRefs(state);

// 打开弹窗 - 暴露出去的方法
const openDialog = async ({id} = {id:""}) => {
  // 编辑还是新增赋值选中id
  initParam.airport =  id ?? "";
  // 打开弹窗的数据初始化
  dialogVisible.value = true;
};

// 获取告警list
const getList = (params) => {
  const data = {
    "page.pageIndex":params.page.pageIndex,
    "page.pageSize":params.page.pageSize,
    ...params,
  };
  delete data.page;
  return getWarningList(data);
};

defineExpose({
  openDialog,
});

</script>
<style lang="scss" scoped>
@import './warning-dialog.scss'
</style>
