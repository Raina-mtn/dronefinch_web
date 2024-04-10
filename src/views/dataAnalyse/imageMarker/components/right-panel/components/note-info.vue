<template>
  <div class="bg-[#193580] p-16px rounded-4px">
    <div class="flex-between pb-8px">
      <span class="text-16px text-white font-bold">备注编号：{{item.num}}</span>
    </div>
    <div>
      <div class="info"><span class="info-title">备注：</span>{{item.commentInfo}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props{
  item:any
  index:number
}
defineProps<Props>();
</script>

<style lang="scss" scoped>
.info{
  @apply text-white pt-4px;
  .info-title {
    @apply text-[#FFFFFFB3];
  }
}
.select{
  @apply py-8px w-full;
}
</style>