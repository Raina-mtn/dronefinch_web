<template>
  <div :class="['w-276px','h-170px','rounded-4px','m-5px','box-border',isCheck?'border-[#369EF8]':'',isCheck?'border-2px':'']" style="box-sizing:border-box" @click="check">
    <el-image class="w-full h-full" :src="url" fit="fill" />
    <img v-if="isCheck" src="@/assets/images/image-check.png" class="relative -top-35px left-[calc(100%_-_30px)]">
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
interface Props{
  url:string
}
withDefaults(defineProps<Props>(),{
  url:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
});

const isCheck = ref(false);
const check = () => {
  isCheck.value = !isCheck.value;
};
</script>

<style scoped>

</style>