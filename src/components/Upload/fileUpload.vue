<template>
  <div class="m-upload">
    <div style="width: 100%;">
      <div v-for="(item,index) of image" :key="item.showName" class="w-full bg-[#148aff] flex items-center justify-between px-16px" >
        <span>{{ item.showName }}.kmz</span>
        <el-icon class="text-20px cursor-pointer" @click="handleRemove(index)"><Close /></el-icon>
      </div>
    </div>
    <el-upload
      list-type="text"
      with-credentials
      :class="{ 'el-upload-limit': image.length >= limit }"
      :action="action"
      :accept="accept"
      :show-file-list="false"
      :name="name"
      :disabled="image.length === limit"
      :on-success="handleSuccess"
      :on-error="uploadError"
      :before-upload="beforeValidate"
    >
    <template #trigger>
      <div v-show="image.length < limit ">
        <el-button type="primary">
          上传文件
        </el-button>
      </div>      
    </template>
    <template #tip>
      <div v-if="tips" class="el-upload__tip">
        {{ tips }}
      </div>
    </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from "vue";
import { ElMessage } from "element-plus";
interface Props{
  modelValue:FileList|undefined  
  imageList?:FileList[]
  tips?:string
  accept?:string
  name?:string
  sizeLimit?:number
  limit?:number
  action?:string
}
interface FileList{
  id:string
  showName:string
}
const props = withDefaults(defineProps<Props>(), {
  accept: ".doc,.docx,.xls,.xlsx",
  name: "file",
  limit:1,
  action:"/api/sps/v1/wayline-file/upload",
  sizeLimit:Infinity,
});
const emits = defineEmits(["update:modelValue"]);
let fileList = ref<FileList[]>(props.limit === 1 ? (props.modelValue ? [props.modelValue] : []) : props.imageList);
const image = computed(() => {
  return props.limit === 1
    ? props.modelValue
      ? [props.modelValue]
      : []
    : props.imageList;
});
watch(() => image.value, (value) => {
  fileList.value = value;
});
watch(() => fileList.value, (value) => {
  if (props.limit > 1) {
    emits("update:modelValue", value);
  } else {
    emits("update:modelValue", value[0]);
  }
}, {deep:true});

const handleRemove = (index) => {
  fileList.value.splice(index, 1);
};

const handleSuccess = (res) => {
  const {data} = res;
  const { code, msg } = res.status;
  if (code === 1 && data) {
    fileList.value.push(data);
  } else {
    return ElMessage.error(msg);
  }
};
// 上传失败
const uploadError = () => {
  ElMessage.error("文件上传失败");
};
const beforeValidate = (file) => {
  const isLtSize = file.size / 1024 <= props.sizeLimit * 1024;
  if (!isLtSize) {
    ElMessage.error(`上传图片大小不能超过 ${props.sizeLimit}M!`);
    return isLtSize;
  }
  return true;
};

</script>
<style lang="scss" scoped>
.m-upload {
  // display: inline-flex;
  align-items: flex-end;
  .flex-img_pic,
  :deep(.el-upload) {
    position: relative;
    
    background: #01498F;
    border-radius: 8px;
    margin-right: 10px;
    .el-image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .no-image{
    width: px2rem(160);
    height: px2rem(160);
    border-radius: 4px;
  }
  .el-upload-box {
    // display: inline-flex;
    align-items: flex-end;
  }
  :deep(.el-upload) {
    // display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-upload-limit {
    :deep(.el-upload) {
      display: none;
    }
  }
  .el-icon-plus {
    font-size: px2rem(40);
    color: #1DE1EC;
  }
  .el-upload {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-icon-error {
    position: absolute;
    z-index: 1024;
    top: -1rem;
    right: -1rem;
    font-size: 2rem;
    // @include font_color("colorPrimary")
  }
  .el-upload__tip {
    white-space: pre-line;
    color: #fff;
  }
}
</style>
