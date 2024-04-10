<template>
    <div class="relative item-box w-100 mb-25px overflow-hidden flex flex-col">
      <section class="relative flex-shrink-0 flex items-center justify-between section-title">
        <slot name="title" >
            <div class="text-xl h-9 title pl-8 flex items-center font-medium">{{ title }}</div>
            <div class="flex-shrink-0 flex items-center justify-end">
              <slot name="titleRight"></slot>
            </div>
        </slot>
      </section>
      <section class="item-content w-full flex-1 overflow-hidden">
          <slot name="content"></slot>
      </section>
    </div>
  </template>
<script setup lang="ts">
import {ref,reactive} from "vue";
const props = defineProps(['title']);
  
  
  
</script>

<style lang="scss" scoped>
@import './work-data-container.scss'



</style>
  