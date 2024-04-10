<template>
  <div class="bg-[#0B2363] p-14px  h-[calc(100%_-_48px)]">
    <ProTable
      ref="proTableRef" 
      :columns="columns" 
      max-height="680" 
      :initParam="initParam" 
      :request-api="(params) => getList(params)"
      :searchToolButton="false"
      >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" class="my-16px" @click="addDialogRef.openDialog(false)">
          <i class="iconfont icon-daoru mr-2.5" />
          导入航线
        </el-button>
      </template>
        <!-- 表格操作 -->
        <template #operation="{ row }">
          <el-button v-for="item in btns" :key="item.label" link :class="[item.label==='删除'?'!text-[#E31515]':'!text-[#0AF0FD]']" @click="item.function(row)"><i :class="['iconfont','mr-4px',item.icon]"/> 
            {{ item.label }}
          </el-button>
        </template>
      </ProTable>
      <addDialog ref="addDialogRef" @refresh="refresh"></addDialog>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";

import { get, del} from "@/api/interface/patrol/airline";
import {columns} from "./config";

import ProTable from "@/components/ProTable/index.vue";
import addDialog from "./components/add-dialog.vue";

import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
const useDictStore = dictStore();
const router = useRouter();


const proTableRef = ref();
const addDialogRef = ref();
const initParam = ref({}); // 参数

// 获取列表
const getList = (params) => {
  const data = {
    "page.pageIndex":params.page.pageIndex,
    "page.pageSize":params.page.pageSize,
    ...params,
  };
  delete data.page;
  return get(data);
};
// 删除
const deletePlan = (row) => {
  console.log("delete", row);
  
  ElMessageBox.confirm("确认删除?", " 提示").then(() => {
    del(row.id).then(() => {
      ElMessage.success("删除成功");
      proTableRef.value.getTableList();
    });
  });
};

//按钮
const btns = [
  {
    label:"任务计划",
    icon:"icon-xiangqing",
    function:(({lineName}) => {
      router.push({ path: "/home/patrol-manage/task-plan", query: { lineName }});
    }),
  },
  {
    label:"设备点标定",
    icon:"icon-biaoji",
    function:(({id}) => {
      router.push({ path: "/home/patrol-manage/equipment-marker", query: { id }});
    }),
  },
  {
    label:"编辑",
    icon:"icon-bianji",
    function:((row) => {
      addDialogRef.value.openDialog(true, row);
    }),
  },
  {
    label:"删除",
    icon:"icon-shanchu",
    function:deletePlan,
  },
];
// 刷新
const refresh = () => {
  proTableRef.value.getTableList();
};

onMounted(async () => {
  await useDictStore.getDictTree(TotalDict.WAYLINE_TYPE);
});

</script>

<style scoped>

</style>