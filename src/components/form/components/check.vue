<template>
  <div class="flex">
    <el-checkbox
      v-if="isCheckAll"
      class="w-1/2"
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
      >{{ checkAllLabel }}</el-checkbox
    >
    <el-checkbox-group
      v-model="checkList"
      @change="handleCheckedChange"
    >
      <el-checkbox v-for="item in options" :key="item.value" :label="item.value">
        {{item.label}}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { ref,PropType,computed } from 'vue'

type Options={
  label:string
  value:string
}
const props = defineProps({
  isCheckAll:{
    type:Boolean,
    default:true
  },
  options:{
    type:Array as PropType<Options[]>,
    default:true
  },
  checkAllLabel:{
    type:String,
    default:''
  },
  checkData:{
    type:Array as PropType<string[]>,
    default:''
  }
}
)
const emits = defineEmits(['update:checkData'])
let checkList = computed({
  get() {
    return props.checkData
  },
  set(value) {
    emits('update:checkData', value);
  },
})

const isIndeterminate = ref(false)
const checkAll = ref(false)

const handleCheckAllChange = (val: boolean) => {
  checkList.value = val ? props.options.map(i=>i.value) : []
  isIndeterminate.value = false
}
const handleCheckedChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === props.options.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.options.length
}

</script>

<style lang="scss" scoped>
.el-checkbox-group{
  :deep(.el-checkbox__inner){
    border-radius: 50%;
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner){
    background-color: #fff;
  }
  :deep(.el-checkbox__inner::after){
    background-color: #409eff;
    content: "";
    width: 6px;
    height: 6px;
    border: 1px solid transparent;
    border-radius: 50%;
    position: absolute;
    left: 2px;
    top: 2px;
  }
}
</style>