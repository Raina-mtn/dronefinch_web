<template>
    <div class="search-header m-6 py-6 px-4 text-sm flex justify-between justify-items-center">
        <div class="flex justify-items-center ">
            <div class="flex flex items-center mr-72px">
                <span class="">设备名称:</span>
                <el-select size="large" v-model="searchParams.deviceName" class="m-2" placeholder="请选择" :remote-method="getDeviceList" filterable remote remote-show-suffix>
                    <el-option v-for="item in deviceList" :key="item.id" :label="item.airportName" :value="item.airportName" />
                </el-select>
            </div>
            <div class="flex flex items-center mr-72px">
                <span>覆盖线路:</span>
                <el-select size="large" v-model="state.searchParams.lineId" class="m-2" placeholder="请选择" :remote-method="getOverlatPathList" filterable remote remote-show-suffix>
                    <el-option v-for="item in pathList" :key="item.lineId" :label="item.lineName" :value="item.lineId" />
                </el-select>
            </div>
            <div class="flex flex items-center mr-7 2px">
                <span>设备状态:</span>
                <el-select size="large" v-model="state.searchParams.deviceStatus" class="m-2" placeholder="请选择">
                    <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
            </div>
        </div>
        <div class="flex justify-items-center">
            <el-button @click="onSearch" type="primary" size="large" icon="Search">搜索</el-button>
            <el-button @click="onRest" size="large" icon="RefreshRight">重置</el-button>
        </div>

    </div>
</template>
  
<script setup lang="ts">
import { reactive, ref, toRefs, onMounted, getCurrentInstance } from "vue";
import * as  monitoringApi from "@/api/interface/monitoring/real-time";
import {getAirportSelect} from "@/api/interface/patrol/airline";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";

const useDictStore = dictStore();

// 获取app的全局属性
const app = getCurrentInstance()?.appContext.config.globalProperties;

const emit = defineEmits(["onSearch"]);

interface DictItem {
  code:string
  name:string
}

interface PathItem {
  lineId:number
  lineName:string
}

interface DeviceItem {
  id:number
  airportName:string
}
const rawParams = {
  deviceName: "",
  lineId: "",
  deviceStatus: "",
};
const state = reactive({
  searchParams: JSON.parse(JSON.stringify(rawParams)),
  deviceList: [] as DeviceItem[],
  pathList: [] as PathItem[],
  statusList: [] as DictItem[],
});
const { searchParams, deviceList, pathList, statusList } = toRefs(state);


onMounted(() => {
  getDeviceList();
  getOverlatPathList();
  getDeviceStatusList();
});

// 搜索
const onSearch = () => {
  emit("onSearch", searchParams.value);
};

// 重置
const onRest = () => {
  searchParams.value = JSON.parse(JSON.stringify(rawParams));
  onSearch();
};

// 获取设备名称选项
const getDeviceList = async (query?: string) => {
  const params = {
    airportName:query,
  };
  const { data } = await getAirportSelect(params);
  deviceList.value = data;
};

// 获取覆盖路线选项
const getOverlatPathList = async (query?: string) => {
  const params = {
    lineName:query,
  };
  const { data:{list} } = await useDictStore.getPartsTypeList(params);
  pathList.value = list;
};

// 获取设备状态选项
const getDeviceStatusList = async () => {
  const { data:{list} } = await useDictStore.getDictTree(TotalDict.AIRPORT_STATUS);
  statusList.value = list;
};

</script>
  
<style lang="scss" scoped>
@import './search-header.scss'
</style>
  