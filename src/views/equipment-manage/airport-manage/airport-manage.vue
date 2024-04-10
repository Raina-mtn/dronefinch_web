<template>
    <div class="text-white m-6 mb-0 list h-full">
      <ProTable   ref="table" title="" :columns="columns" :request-api="(params) => getList(params)" max-height="680"
         :searchCol="4">
        <!-- 表格 header 按钮 -->
        <template #tableHeader="scope">
          <el-button type="primary" @click="addAirport">
            <i class="iconfont icon-a-tianjiaxiawu32808 mr-2.5" />
            新增机场
          </el-button>
        </template>
        <template #index>
          <div></div>
        </template>
        <template #searchHeader>
          <div></div>
        </template>
        <template #status="{row}">
          <span :class="['status',statusMap[row.deviceStatus]?.class]">{{ statusMap[row.deviceStatus].text }}</span>
        </template>
        <!-- 表格操作栏 -->
        <template #operation="{ row }">
          <template v-for="button in statusMap[row.deviceStatus].operate" :key="button">
            <!-- 按钮无需确认 -->
            <el-button v-if="!statusButtonMap[button].needConfirm" type="primary" link @click="customButtonEvent(button,row)">
              <i :class="['iconfont mr-1px',statusButtonMap[button].icon]" />
              {{statusButtonMap[button].name}}
            </el-button>
            <!-- 按钮需确认 -->
            <el-popconfirm v-else :title="'确定'+statusButtonMap[button].name+'?'" @confirm="customButtonEvent(button,row)">
              <template #reference>
                <el-button type="primary" :class="statusButtonMap[button].class" link>
                  <i :class="['iconfont mr-1px',statusButtonMap[button].icon]" />
                  {{statusButtonMap[button].name}}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </template>
      </ProTable>
      <!-- 新增编辑机场弹窗 -->
      <AirportDialog ref="ariportDialogRef" @refresh="refreshList" />
      <!-- 告警弹窗 -->
      <WarningDialog ref="warningDialogRef" />

    </div>
  </template>
<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from "vue";
import { columns, statusMap, statusButtonMap } from "./config";
import * as airportManageApi from "@/api/interface/equipment-manage/airport";
import ProTable from "@/components/ProTable/index.vue";
import AirportDialog from "./components/airport-dialog/airport-dialog.vue";
import WarningDialog from "@/views/monitoring/real-time-monitoring/components/warning-dialog/warning-dialog.vue";
import { useRouter } from "vue-router";
  
// 获取app的全局属性
const app = getCurrentInstance()?.appContext.config.globalProperties;
const router = useRouter();

const table = ref();
const ariportDialogRef = ref();
const warningDialogRef = ref();

onMounted(() => {
});

// 获取列表
const getList = (params) => {
  // console.log(params);
  const data = {
    "page.pageIndex":params.page.pageIndex,
    "page.pageSize":params.page.pageSize,
    ...params,
  };
  delete data.page;
  return airportManageApi.getAirportManageList(data);
};
  
  
// 远程调试
const jumpRemote = (row) => {
  router.push({ path: "/home/equipment-manage/remote-debugging", query: { id: "123" }});
};
  
// 删除记录
const onDelete = async ({id}) => {
  const { status: {  msg } } = await airportManageApi.deleteRecord(id);
  app?.$message.success(msg);
  table.value.getTableList();
 
};
  
// 新增弹窗
const addAirport =  () => {
  ariportDialogRef.value.openDialog();
};
  
// 编辑弹窗
const onEdit =  (row) => {
  ariportDialogRef.value.openDialog(row);
};

// 页面list刷新
const refreshList = () => {
  table.value.getTableList();
};
  


// 展示告警信息
const showWarning = (row) => {
  warningDialogRef.value.openDialog(row);
};


// 操作按钮事件
const customButtonEvent = (button, row) => {
  const funcMap = {
    showWarning,
    jumpRemote,
    onEdit,
    onDelete,
  };
  funcMap[statusButtonMap[button].func] && funcMap[statusButtonMap[button].func](row);
};

  
  
</script>
  <style lang="scss" scoped>
  @import './airport-manage.scss'
  </style>