<template>
  <div class="bg-[#193580] p-16px rounded-4px">
    <div class="flex-between pb-8px">
      <span class="text-16px text-white font-bold">备注编号：{{item.num}}</span>
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
      <div class="info"><span class="info-title">备注：</span>{{item.commentInfo}}</div>
    </div>
    <div v-else>
      <el-input v-model="formData.commentInfo" placeholder="请输入备注"  class="mb-16px"/>
      <el-button color="#369EF8" class="w-full text-white py-8px" @click="submit">确认复核</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from "vue";
import { ReviewCommentList } from "../../../interface";

// 在setup函数中获取实例对象并定义bus
const instance = getCurrentInstance();
const bus = instance?.appContext.config.globalProperties.$bus;

interface Props{
  item:ReviewCommentList
  isAudit:boolean
}
const props = defineProps<Props>();

const isEdit = ref(false);
const formData = computed(() => {
  return props.item;
});
const submit = () => {
  bus.emit("changeInfo", {type:"note", operate:"update", newInfo:formData.value});
  isEdit.value = false;
};
const deleteItem = () => {
  bus.emit("changeInfo", {type:"note", operate:"delete", newInfo:formData.value});
};
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