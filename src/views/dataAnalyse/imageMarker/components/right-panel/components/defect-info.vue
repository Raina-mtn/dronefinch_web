<template>
  <div class="bg-[#193580] p-16px rounded-4px">
    <div class="flex-between pb-8px">
      <span class="text-16px text-white font-bold">缺陷编号：{{item.num}}</span>
    </div>
    <div>
      <div class="info"><span class="info-title">缺陷等级：</span>{{defectLevelListObj[item.defectLevel||'']||''}}</div>
      <div class="info"><span class="info-title">缺陷类型：</span>{{defectTypeListObj[item.defectType||'']||''}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { InfoList } from "../../../interface";
import { dictStore } from "@/store/index";
import { TotalDict } from "@/enums/dict-code";
import {arrToObj} from "@/utils/config";
const useDictStore = dictStore();

interface Props{
  item:InfoList
}
defineProps<Props>();


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