<template>
  <div class="bg-[#193580] p-16px rounded-4px">
    <div class="flex-between pb-8px">
      <span class="text-16px text-white font-bold">缺陷编号：{{item.num}}</span>
      <div v-if="isAudit">
        <el-link v-if="!isEdit" :underline="false" class="text-[#0AF0FD] text-16px px-8px" @click="isEdit = true">
          <i class="iconfont icon-bianji"></i>
        </el-link>
        <el-link v-else :underline="false" class="text-[#0AF0FD] text-16px px-8px" @click="isEdit = false">
          <i class="iconfont icon-wancheng"></i>
        </el-link>
        <el-link :underline="false" class="text-[#0AF0FD] text-16px px-8px" @click="deleteItem">
          <i class="iconfont icon-shanchu"></i>
        </el-link>
      </div>
    </div>
    <div v-if="!isEdit">
      <div class="info"><span class="info-title">缺陷等级：</span>{{defectLevelListObj[item.defectLevel||'']||''}}</div>
      <div class="info"><span class="info-title">缺陷类型：</span>{{defectTypeListObj[item.defectType||'']||''}}</div>
    </div>
    <div v-else>
      <el-select v-model="formData.defectLevel" placeholder="请选择缺陷等级" class="select">
        <el-option
          v-for="item in defectLevelList"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
      <el-select v-model="formData.defectType" placeholder="请选择缺陷类型" class="select">
        <el-option
          v-for="item in defectTypeList"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
      <el-button color="#369EF8" class="w-full text-white py-8px" @click="submit">确认复核</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance } from "vue";
import { InfoList } from "../../../interface";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
import {arrToObj} from "@/utils/config";
const useDictStore = dictStore();

// 在setup函数中获取实例对象并定义bus
const instance = getCurrentInstance();
const bus = instance?.appContext.config.globalProperties.$bus;

interface Props{
  item:InfoList
  isAudit:boolean
}
const props = defineProps<Props>();

const isEdit = ref(false);
const formData = computed(() => {
  return props.item;
});

const submit = () => {
  bus.emit("changeInfo", {type:"defect", operate:"update", newInfo:formData.value});
  isEdit.value = false;
};
const deleteItem = () => {
  bus.emit("changeInfo", {type:"defect", operate:"delete", newInfo:formData.value});
};
// 缺陷等级
const defectLevelList = computed(() => {
  return useDictStore.statusMapList[TotalDict.REVIEW_DEFECT_LEVEL];
});
const defectLevelListObj = computed(() => {
  return arrToObj(defectLevelList.value ?? [], {
    key: "code",
    label: "name",
  });
});
// 缺陷类型
const defectTypeList = computed(() => {
  return useDictStore.statusMapList[TotalDict.REVIEW_DEFECT_TYPE];
});
const defectTypeListObj = computed(() => {
  return arrToObj(defectTypeList.value ?? [], {
    key: "code",
    label: "name",
  });
});
onMounted(async () => {
  await useDictStore.getDictTree(TotalDict.REVIEW_DEFECT_LEVEL);
  await useDictStore.getDictTree(TotalDict.REVIEW_DEFECT_TYPE);
});
</script>

<style lang="scss" scoped>
.info{
  @apply text-white pt-4px;
  .info-title {
    @apply text-[#FFFFFFB3];
  }
}
.select{
  @apply py-8px w-full;
}
</style>