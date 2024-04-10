<!--
 * @Date: 2023-11-02 15:32:55
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-11-07 13:31:48
 * @FilePath: \dronefinch_web\src\views\equipment-manage\drone-mange\drone-mange.vue
-->
<template>
  <ProTable
    ref="proTableRef"
    title="飞行器管理"
    :columns="columns"
    :request-api="(params) => requestApi(params)"
    max-height="680"
    :searchToolButton="false"
    :data="state.tableData"
    highlight-current-row
    :searchCol="5"
  >
    <template #searchBottom>
      <el-form-item>
        <el-button
          @click="createDrone"
          style="float: left; margin-bottom: 16px"
          type="primary"
          ><el-icon> <Plus /> </el-icon>新增飞行器</el-button
        >
      </el-form-item>
    </template>
    <template #operation="{ row }">
      <el-button type="primary" link @click="editDrone(row)"
        ><i class="iconfont icon-bianji" /> 编辑
      </el-button>
      <el-button
        :icon="Delete"
        type="danger"
        @click="deleteDroneApi(row['id'])"
        link
      >
        删除
      </el-button>
    </template>
  </ProTable>
  <DroneDialog ref="droneDialogRef" />
</template>
<script setup lang="ts">
import { reactive, onBeforeMount, ref } from "vue";
import { getColumns } from "./config";
import ProTable from "@/components/ProTable/index.vue";
import {
    getDroneList,
    apiGetDictTree,
    getAirportList,
    deleteDrone
} from "@/api/interface/index";
import DroneDialog from "./drone-dialog.vue";
import { Delete } from "@element-plus/icons-vue";

const state = reactive({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tableData: <any>[],
    droneModelList: <object>[],
    belongAirportList: <object>[],
});
const columns = getColumns(state);
const proTableRef = ref();
const droneDialogRef = ref();

onBeforeMount(() => {
    getBasicData();
});

const requestApi = async (params: {
  page: { pageIndex: number; pageSize: number };
  deviceModel: string;
  belongAirport: number;
}) => {
    const {
        page: { pageIndex, pageSize },
        deviceModel = null,
        belongAirport = null,
    } = params;

    state.tableData = (
        await getDroneList({
            "page.pageIndex": pageIndex,
            "page.pageSize": pageSize,
            deviceModel,
            belongAirport,
        })
    ).data.list;
};

const getBasicData = () => {
    apiGetDictTree({ dictTypeCode: "DRONE_MODEL" }).then((res) => {
        state.droneModelList = res.data.list;
    });

    getAirportList({ "page.pageIndex": 1, "page.pageSize": 9999 }).then((res) => {
        state.belongAirportList = res.data.list;
    });
};

const createDrone = async () => {
    await  droneDialogRef.value.open();
    proTableRef.value.getTableList();
};

const editDrone = async (row) => {
    await  droneDialogRef.value.open(row);
    proTableRef.value.getTableList();
};

const deleteDroneApi = async (id: number) => {
    await deleteDrone(id);
    proTableRef.value.getTableList();
};
</script>
