<template>
  <el-cascader
    v-model="model[column.prop]"
    v-bind="column"
    :placeholder="column!.placeholder? column!.placeholder : column!.label"
    :options="list"
    :props="{...column?.cascaderProps}"
    style="width: 100%;"
  >
    </el-cascader>
</template>

<script setup lang="ts">
import {computed,ref,onMounted} from 'vue'
import { IFormItem } from "../types"
interface Props {
  column: IFormItem
  model: any
}
const props = defineProps<Props>()

let listData = ref([])
const list = computed(()=>{
  if(props.column.options) return props.column.options
  return listData.value
})

const getData = ()=>{
    if (!props.column.getList) return
    props.column.getList({ ...props.column.params}).then((res=[]) => {
      listData.value = res
    }).catch((err:any) => {
      return Promise.reject(err)
    })
  }
  onMounted(() => {
    getData()
  })

</script>

<style scoped>

</style>