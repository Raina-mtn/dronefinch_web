<template>
  <el-form ref="formRef" class="custom w-full" :model="formData" :label-width="labelWidth" :label-position="labelPosition" v-bind="$attrs" :size="size">
    <el-row>
      <el-col v-for="column in columns" :key="column.prop" :span="column.span || 12">
        <el-form-item v-bind="column" :label-width="!column.label?'10px':column.labelWidth||labelWidth">
          <slot :name="column.prop" :column="column">
            <formItem
              :column="column"
              :model="formData">
            </formItem>
            <span class="text-[#666] text-[12px] mt-5px">{{ column.tips }}</span>
          </slot>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import {ref} from "vue";
import { IFormItem } from "./types";
import formItem from "./formItem.vue";

  interface Props{
    formData:any
    labelWidth?:string
    size?:string
    labelPosition?:string
    columns:IFormItem[],
  }
defineProps<Props>();
// 表单 DOM 元素
const formRef = ref();
// 暴露变量
defineExpose({
  element: formRef,
});
</script>
<style lang="scss" scoped>
.el-form-item{
  margin:10px 0;
}

</style>