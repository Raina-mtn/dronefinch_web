<!--
 * @Date: 2023-11-02 15:32:55
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-11-07 12:51:13
 * @FilePath: \dronefinch_web\src\views\equipment-manage\alramConfig\alram-config.vue
-->
<template>
  <ProTable
    ref="proTableRef"
    title="配置管理"
    :columns="columns"
    :request-api="(params) => getDictionaryList(params)"
    max-height="680"
    :searchToolButton="false"
    :data="state.tableData"
    highlight-current-row
    :searchCol="5"
  >
    <template #searchBottom>
      <el-form-item>
        <el-button
          @click="createAlarm"
          style="float: left; margin-bottom: 16px"
          type="primary"
          ><el-icon> <Plus /> </el-icon>新增告警阈值</el-button
        >
      </el-form-item>
    </template>
    <template #operation="{ row }">
      <el-button type="primary" link @click="editAlarm(row)"
        ><i class="iconfont icon-bianji" /> 编辑
      </el-button>
      <el-button
        :icon="Delete"
        type="danger"
        @click="deleteAlarm(row['id'])"
        link
      >
        删除
      </el-button>
    </template>
  </ProTable>
  <AlarmDialog ref="alarmDialogRef" />
</template>
<script setup lang="ts">
import { reactive, onBeforeMount, ref } from "vue";
import { getColumns } from "./config";
import ProTable from "@/components/ProTable/index.vue";
import {
  getConfigAlarmList,
  apiGetDictTree,
  getDevicePartsSelect,
  deleteConfigAlarm,
} from "@/api/interface/index";
import AlarmDialog from "./alarm-dialog.vue";
import { Delete } from "@element-plus/icons-vue";

const state = reactive({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: <any>[],
  detectTypeOptions: <object>[],
  effectTypeOptions: <object>[],
});

const columns = getColumns(state);

const proTableRef = ref();

const alarmDialogRef = ref();

onBeforeMount(() => {
  apiGetDictTree({ dictTypeCode: "PARTS_DETECT_TYPE" }).then((res) => {
    state.detectTypeOptions = res.data.list;
  });

  getDevicePartsSelect().then((res) => {
    state.effectTypeOptions = res.data;
  });
});

const getDictionaryList = async (params: {
  page: { pageIndex: number; pageSize: number };
  detectType: string;
  effectType: string;
}) => {
  const {
    page: { pageIndex, pageSize },
    detectType = null,
    effectType = null,
  } = params;

  state.tableData = (
    await getConfigAlarmList({
      "page.pageIndex": pageIndex,
      "page.pageSize": pageSize,
      detectType,
      effectType,
    })
  ).data.list;
};

const createAlarm = async () => {
  await alarmDialogRef.value.open();
  proTableRef.value.getTableList();
};

const editAlarm = async (row) => {
  await alarmDialogRef.value.open(row);
  proTableRef.value.getTableList();
};

const deleteAlarm = async (id: number) => {
  await deleteConfigAlarm(id);
  proTableRef.value.getTableList();
};
</script>
