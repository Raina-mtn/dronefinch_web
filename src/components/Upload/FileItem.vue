<template>
  <div class="file-item">
    <div class="item bg-[#148aff]">
      <!-- <div class="item-icon">
        <i :class="`iconfont icon-${fileIcon}`" style="font-size: 24px; " />
      </div> -->
      <a :href="`/api${file}`">
        {{ fileName }}
      </a>
    </div>
    <el-icon class="text-20px cursor-pointer" @click="handleRemove"><Close /></el-icon>
  </div>
</template>

<script setup lang="ts">
// const { VITE_APP_BASE_API,ENV } = import.meta.env;
import {computed} from 'vue';
interface Props{
  file:string
  index:number
}
const props = defineProps<Props>();
const emit = defineEmits(['handleRemove']);

const fileType = computed(() => {
  return props.file.split('.').pop();
});
const fileName = computed(() => {
  return props.file.split('/').pop();
});
const fileIcon = computed(() => {
  let icon;
  switch(fileType.value){
  case 'doc':
    icon =  'word';
    break;
  case 'docx':
    icon =  'word';
    break;
  case 'pptx':
    icon =  'ppt';
    break;
  case 'pdf':
    icon =  'pdf';
    break;
  case 'xls':
    icon =  'excel';
    break;
  case 'xlsx':
    icon =  'excel';
    break;
  default:
    icon =  'file';
  }
  return icon;
});

const handleRemove =() => {
  emit('handleRemove',props.index);
};
</script>

<style lang="scss" scoped>
.file-item{
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .item{
    display: flex;
    align-items: center;
    .item-icon{
      background-color: #148aff;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
    }
  }
}
</style>