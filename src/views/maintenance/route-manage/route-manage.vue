<template>
  <div class="text-white m-6 mb-0 list h-full">
    <ProTable  ref="table" title="" :columns="columns" :request-api="(params) => getList(params)" max-height="680"
       :searchCol="4">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" @click="openRouteDialog">
          <i class="iconfont icon-a-tianjiaxiawu32808 mr-2.5" />
          新增
        </el-button>

      </template>
      <template #searchHeader>
        <div></div>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <!-- <el-button type="primary" link @click="jumpTask(row)">
          <i class="iconfont icon-xiangqing mr-1px" />
          任务记录
        </el-button> -->
        <el-button type="primary" link @click="editRouteDialog(row)">
          <i class="iconfont icon-bianji  mr-1px" />
          编辑
        </el-button>
        <el-popconfirm title="确定删除?" @confirm="deleteRoute(row)">
          <template #reference>
            <el-button type="primary" class="delete-button" link>
              <i class="iconfont icon-shanchu mr-1px" />
              删除
            </el-button>
          </template>
        </el-popconfirm>

      </template>
    </ProTable>
    <RouteDialog :visible="routeDialogVisible" :id="selectId" @onClose="closeRouteDialog"/>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from "vue";
import { columns } from "./config";
import * as lineManageApi from "@/api/interface/maintenance/line";
import ProTable from "@/components/ProTable/index.vue";
import RouteDialog from "./components/route-dialog/route-dialog.vue";
import {last} from "lodash";
import { router } from "@/router";

// 获取app的全局属性
const app = getCurrentInstance()?.appContext.config.globalProperties;

let routeDialogVisible = ref(false);//弹窗visible
let selectId = ref("");//编辑选中id
const table = ref();


// 获取列表
const getList = (params) => {
  const data = {
    ...params,
    "page.pageIndex":params.page.pageIndex,
    "page.pageSize":params.page.pageSize,
    "district":last(params.district),
  };
  delete data.page;
  return lineManageApi.getRouteManageList(data);
};


// 任务记录跳转
const jumpTask = (row) => {
  router.push({path:"/home/patrol-manage/task-record?"});
};

// 删除
const deleteRoute = async ({lineId}) => {
  const { status: { msg } } = await lineManageApi.deleteRoute(lineId);
  app?.$message.success(msg);
  table.value.getTableList();
  
};

// 新增弹窗
const openRouteDialog = () => {
  selectId.value = "";
  routeDialogVisible.value = true;
};

// 编辑弹窗
const editRouteDialog = ({lineId}) => {
  selectId.value = lineId;
  routeDialogVisible.value = true;
};

// 关闭弹窗
const closeRouteDialog = (refresh:boolean) => {
  routeDialogVisible.value = false;
  refresh && table.value.getTableList();
};


</script>
<style lang="scss" scoped>
@import './route-manage.scss'
</style>