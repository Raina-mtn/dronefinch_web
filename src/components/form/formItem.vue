<template>
  <!-- input -->
  <el-input 
    v-if="column.el === 'input'"
    v-model="model[column.prop]"
    v-bind="{...column,...placeholder}"
    @change="inputChange($event,column.prop)"
  />
  <!-- select -->
  <WSelect 
    v-else-if="column.el === 'select'"
    :model="model"
    :column="{...column,...placeholder}"
  ></WSelect>
  <!-- date-picker -->
  <el-date-picker
    class="!w-full"
    v-else-if="column.el === 'date-picker'"
    v-model="model[column.prop]"
    v-bind="{...column,...placeholder}"
    range-separator="-"
    :value-format="column.format||'YYYY-MM-DD hh:mm:ss'"
  />
  <!-- time-picker -->
  <el-time-picker
    class="!w-full"
    v-else-if="column.el === 'time-picker'"
    v-model="model[column.prop]"
    v-bind="{...column,...placeholder}"
    :value-format="column.format||'HH:mm:ss'"
  />
  <!-- checkbox -->
  <div v-else-if="column.el === 'checkbox'" :style="{display: column.checkIsWrap?'block':'flex'}">
    <el-checkbox
      v-if="column.hasCheckAll"
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
      style="margin-right: 20px;"
    >
      全选
    </el-checkbox>
    <el-checkbox-group v-model="model[column.prop]" v-bind="column" class="flex flex-wrap">
      <el-checkbox
        class="w-[25%]"
        v-for="item in column.dataList"
        :key="item[optionsKey.value]"
        :label="item[optionsKey.value]"
        @change="handleCheckedChange"
      >
        {{ item[optionsKey.label]}}
      </el-checkbox>
    </el-checkbox-group>
  </div>
  <!-- radio -->
  <el-radio-group v-else-if="column.el === 'radio'" v-model="model[column.prop]" v-bind="column">
    <el-radio
      v-for="item in column.dataList"
      :key="item[optionsKey.label]"
      :label="item[optionsKey.value]"
    >
      {{ item[optionsKey.label] }}
    </el-radio>
  </el-radio-group>
  <!-- cascader -->
  <WCascader
    v-else-if="column.el === 'cascader'"
    :model="model"
    :column="column"
  ></WCascader>
  <!-- switch -->
  <el-switch v-else-if="column.el === 'switch'" v-model="model[column.prop]" v-bind="column" />
  <span v-else style="display:inline-block;">{{ model[column.prop] }}</span>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { IFormItem } from "./types";
import WSelect from "./components/select.vue";
import WCascader from "./components/cascader.vue";
interface Props {
  column: IFormItem
  model: any
}
const props = defineProps<Props>();
const emit = defineEmits(["inputChange"]);
// 处理默认 placeholder
const placeholder = computed(() => {
  const column = props.column;
  if (column.type && ["datetimerange", "daterange", "monthrange"].includes(column.type)) {
    return { rangeSeparator: "至", startPlaceholder: "开始时间", endPlaceholder: "结束时间"};
  }
  const placeholder = column.placeholder ?? (column.el?.includes("input") ? "请输入"  : "请选择");
  return { placeholder };
});

//下拉框
const optionsKey = computed(() => {
  if (props.column.optionsKey) return props.column.optionsKey;
  return {
    label:"label",
    value:"value",
  };
});

const inputChange = (data:any, key:string) => {
  if (props.column.listeners) return;
  emit("inputChange", data, key);
};

//全选
let checkAll = ref(false);
let isIndeterminate = ref(false);
const handleCheckAllChange = (value: string | number | boolean) => {
  props.model[props.column.prop] = !value ? [] : props.column.dataList?.map((item:{[key: string]: string}) => item[optionsKey.value.value]);
  isIndeterminate.value = false;
};
const handleCheckedChange = () => {
  if (props.column.hasCheckAll) {
    const checkedCount = props.model[props.column.prop].length;
    checkAll.value = checkedCount === props.column.dataList?.length;
    isIndeterminate.value = props.column.dataList?.length ? (checkedCount > 0 && checkedCount <  props.column.dataList?.length) : false;
  }
};
</script>

<style scoped>

</style>