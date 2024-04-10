<template>
  <el-image :class="['w-[calc(50%_-_8px)]','h-111px','my-8px','box-border',checkId===id?'border-[#369EF8]':'',checkId===id?'border-2px':'','cursor-pointer']" :src="url" fit="fill" />
</template>

<script setup lang="ts">
interface Props{
  checkId?:number
  id:number
  url:string
}

defineProps<Props>();

</script>

<style scoped>

</style>