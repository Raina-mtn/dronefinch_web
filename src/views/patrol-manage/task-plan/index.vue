<template>
  <div class="bg-[#0B2363] p-14px  h-[calc(100%_-_48px)]">
    <ProTable
      ref="proTableRef" 
      :columns="tableColums" 
      max-height="680" 
      :initParam="initParam" 
      :request-api="(params) => getList(params)"
      :searchToolButton="false"
      >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" class="my-16px" @click="addDialogRef.openDialog(false)">
          <i class="iconfont icon-a-tianjiaxiawu32808 mr-2.5" />
          新增任务
        </el-button>
      </template>
        <!-- 表格操作 -->
        <template #operation="{ row }">
          <el-button v-for="item in executeStatus[row.taskStatus].operation" :key="item.label" link :class="[item==='delete'?'!text-[#E31515]':'!text-[#0AF0FD]']" @click="btns[item].function(row)"><i :class="['iconfont','mr-4px',btns[item].icon]"/> 
            {{ btns[item].label }}
          </el-button>
        </template>
      </ProTable>
      <addDialog ref="addDialogRef" @refresh="refresh"></addDialog>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed} from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { get, del, startPlan} from "@/api/interface/patrol/plan";

import {columns} from "./config";
import {executeStatus} from "@/utils/enum/taskRecordEnum";

import ProTable from "@/components/ProTable/index.vue";
import addDialog from "./components/add-dialog.vue";



const proTableRef = ref();
const addDialogRef = ref();
const initParam = reactive({}); // 参数
const router = useRouter();
const route = useRoute();
const lineName = ref(route.query.lineName || null);
const tableColums = computed(() => columns(lineName.value as string));

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

// 刷新
const refresh = () => {
  proTableRef.value.getTableList();
};

// 删除
const deletePlan = ({id}) => {
  console.log("delete", id);
  
  ElMessageBox.confirm("确认删除?", " 提示").then(() => {
    del(id).then(() => {
      ElMessage.success("删除成功");
      refresh();
    });
  });
};
// 立即执行
const start = ({id}) => {
  console.log("start", id);
  
  ElMessageBox.confirm("确认立即执行该任务?", " 提示").then(() => {
    startPlan(id).then(() => {
      ElMessage.success("执行成功!");
      refresh();
    });
  });
};

//按钮
const btns = {
  // 接口
  execute:{
    label:"立即执行",
    icon:"icon-bofang",
    function:start,
  },
  record:{
    label:"巡检记录",
    icon:"icon-xiangqing",
    function:(({taskName}) => {
      router.push({ path: "/home/patrol-manage/task-record", query: { taskName }});
    }),
  },
  edit:{
    label:"编辑",
    icon:"icon-bianji",
    function:((row) => {
      addDialogRef.value.openDialog(true, row);
    }),
  },
  delete:{
    label:"删除",
    icon:"icon-shanchu",
    function:deletePlan,
  },
};
</script>

<style scoped>

</style>