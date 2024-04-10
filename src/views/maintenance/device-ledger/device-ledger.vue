<template>
  <div class="text-white m-6 mb-0 list h-full">
    <ProTable ref="table" title="" :columns="columns" :request-api="(params) => getList(params)" max-height="680"
       :searchCol="4">
       <template #searchHeader>
        <div ></div>
      </template>

      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope" >
        <div class="flex items-center">
          <el-button type="primary" class="mr-4"  @click="addDevice" >
            <i class="iconfont mr-2.5 icon-a-tianjiaxiawu32808" />
            添加设备
          </el-button>
          <!-- 导入设备文件上传 -->
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            :multiple="false"
            :show-file-list="false"
            :http-request="uploadFile"
          >
            <el-button type="primary"  class="mr-4" >
              <i class="iconfont mr-2.5 icon-daochu" />
              导入设备
            </el-button>
          </el-upload>
              
          <el-button type="primary" class="mr-4"  @click="downloadTemplate" >
            <i class="iconfont mr-2.5 icon-daochu" />
            模版下载
          </el-button>
        </div>
      </template>

      <template #demarcateType="{row}">
        <span :class="['status',denarcateStatus[row.markStatus]?.class]">{{ denarcateStatus[row.markStatus].text }}</span>
      </template>

      <!-- 表格操作栏 -->
      <template #operation="{ row }">
        <template v-for="button in denarcateStatus[row.markStatus].operate" :key="button">
          <!-- 按钮无需确认 -->
          <el-button v-if="!denarcateButtonMap[button].needConfirm" type="primary" link @click="customButtonEvent(button,row)">
            <i :class="['iconfont mr-1px',denarcateButtonMap[button].icon]" />
            {{denarcateButtonMap[button].name}}
          </el-button>
          <!-- 按钮需确认 -->
          <el-popconfirm v-else :title="'确定'+denarcateButtonMap[button].name+'?'" @confirm="customButtonEvent(button,row)">
            <template #reference>
              <el-button type="primary" :class="denarcateButtonMap[button].class" link>
                <i :class="['iconfont mr-1px',denarcateButtonMap[button].icon]" />
                {{denarcateButtonMap[button].name}}
              </el-button>
            </template>
          </el-popconfirm>
        </template>
        

      </template>
    </ProTable>
    <DeviceDialog :visible="dialogVisible" :id="selectId" @onClose="closeDialog"/>
  </div>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance, onBeforeMount } from "vue";
import type {  UploadUserFile } from "element-plus";
import { useRouter } from "vue-router";

import { columns, denarcateStatus, denarcateButtonMap } from "./config";
import * as devicePartsApi from "@/api/interface/maintenance/device-parts";
import {downloadByData} from "@/utils/download";

import ProTable from "@/components/ProTable/index.vue";
import DeviceDialog from "./components/device-dialog/device-dialog.vue";

// 获取app的全局属性
const app = getCurrentInstance()?.appContext.config.globalProperties;
const router = useRouter();

let dialogVisible = ref(false);//弹窗visible
let selectId = ref("");//编辑选中id
const table = ref();
let fileData:any = null;
const fileList =  ref<UploadUserFile[]>([]);

onBeforeMount(() => {
});

/**
 * @description: 获取模板下载地址
 * @return {*}
 */
const getDownloadFile = async () => {
  const res = await devicePartsApi.downloadDeviceFile();

  // 根据是否有返回的文件名字 判断是否报错 返回的报错需要转会json 而不是arraybuffer
  if (!res.headers["download-filename"]){
    const arrayBuffer =  res.data;
    const textDecoder = new TextDecoder("utf-8");
    let jsonString = textDecoder.decode(arrayBuffer);
    // 将字符串解析为 JSON 对象
    let jsonObject = JSON.parse(jsonString);
    console.log(jsonObject);

    app?.$message.error(jsonObject.detail);
    return Promise.reject();
  }
  fileData = res;
};

/**
 * @description: 模板下载
 * @return {*}
 */
const downloadTemplate = async () => {
  await getDownloadFile();
  downloadByData(fileData.data,  decodeURI(fileData.headers["download-filename"]), "excel");
};


/**
 * @description: 获取列表
 * @param {*} params
 * @return {*}
 */
const getList = (params) => {
  const data = {
    "page.pageIndex":params.page.pageIndex,
    "page.pageSize":params.page.pageSize,
    ...params,
  };
  delete data.page;
  return devicePartsApi.getDevicePartsList(data);
};

// 巡检记录跳转
const jumpRecord = ({id}) => {
  // router.push({ path: '/home/patrol-manage/artificial-audit', query: { userId: '123' }});
};

// 删除记录
const onDelete = async ({id}) => {
  const { status: { msg } } = await devicePartsApi.deleteDevice(id);
  app?.$message.success(msg);
  table.value.getTableList();
};

// 添加设备弹窗
const addDevice = () => {
  selectId.value = "";
  dialogVisible.value = true;
};

// 编辑弹窗
const editDevice = ({id}) => {
  selectId.value = id;
  dialogVisible.value = true;
};

// 关闭弹窗
const closeDialog = (refresh) => {
  dialogVisible.value = false;
  refresh && table.value.getTableList();
};


// 操作按钮事件
const customButtonEvent = (button, row) => {
  const funcMap = {
    jumpRecord,
    editDevice,
    onDelete,
  };
  funcMap[denarcateButtonMap[button].func] && funcMap[denarcateButtonMap[button].func](row);
};

// 上传文件
const uploadFile = async (options) => {
  let formData = new FormData();
  formData.append("file", options.file);

  await devicePartsApi.uoloadDeviceFile(formData);

  app?.$message.success("成功");
  table.value.getTableList();
};



</script>
<style lang="scss" scoped>
@import './device-ledger.scss'
</style>