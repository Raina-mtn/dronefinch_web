<template>
  <el-select
    v-model="model[column.prop]"
    loading-text="加载中"
    noDataText="暂无数据"	
    v-bind="column"
    :loading="loading"
    :placeholder="column!.placeholder? column!.placeholder : column!.label"
    :remote-method="remoteMethod"
    style="width: 100%;"
  >
    <el-option
      v-for="item in list"
      :key="item[optionsKey.value]"
      :label="item[optionsKey.label]"
      :value="item[optionsKey.value]"
    />
    </el-select>
</template>

<script setup lang="ts">
import {computed, ref, onMounted} from "vue";
import { IFormItem } from "../types";
interface Props {
  column: IFormItem
  model: any
}
const props = defineProps<Props>();
const optionsKey = computed(() => {
  if (props.column.optionsKey) return props.column.optionsKey;
  return {
    label:"label",
    value:"value",
  };
});

//下拉loading
let loading = ref(false);
let listData = ref([]);
const list = computed(() => {
  if (props.column.options) return props.column.options;
  return listData.value;
});

const remoteMethod = (query:string) => {
  const params:any = {};
  if (props.column.remoteKey) params[props.column.remoteKey] = query;
  if (props.column.remote !== undefined && props.column.remote !== false && props.column.remote !== null) {
    getData(params);
  }
};
const getData = (otherData = {}) => {
  if (!props.column.getList) return;
  loading.value = true;
  props.column.getList({ ...props.column.params, ...otherData }).then((res = []) => {
    listData.value = res;
    // this.getCurrentObj()
    loading.value = false;
  }).catch((err:any) => {
    loading.value = false;
    return Promise.reject(err);
  });
};
onMounted(() => {
  getData();
});

</script>

<style scoped>

</style>