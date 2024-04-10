<template>
  <div class="p-16px">
    <el-select v-model="form.detectStatus" clearable placeholder="请选择识别状态" class="w-full mb-16px">
      <el-option
        v-for="item in detectStatusList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
  </el-select>
    <el-select v-model="form.reviewStatus" clearable placeholder="请选择复核状态" class="w-full mb-16px">
      <el-option
        v-for="item in reviewStatusList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
  </el-select>
  <div class="flexwrap flex-between">
    <imageItem v-for="item in imageList" :key="item.id" :id="item.id" :check-id="currenCheck.id" :url="item.imageUrl" @click="setCurrentCheck(item)"></imageItem>
  </div>
  </div>
</template>

<script setup lang="ts" name="leftPanel">
import { ref, watch } from "vue";
import {Image} from "../../interface";
import {detectStatusList, reviewStatusList} from "@/utils/config";
import imageItem from "./components/image-item.vue";
interface Props{
  imageList:Image[]
  currenCheck:Image
}
interface Form{
  detectStatus?:string
  reviewStatus?:string
}
defineProps<Props>();
const emit = defineEmits(["setCurrentCheck", "getList"]);
const form = ref<Form>({} as Form);

const setCurrentCheck = (item) => {
  emit("setCurrentCheck", item);
};
watch(() => form.value, (newVal) => {
  emit("getList", newVal);
}, {deep:true});

</script>

<style scoped>

</style>