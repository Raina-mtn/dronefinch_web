<template>
  <section class="flex justify-between">
    <section class="flex flex-col flex-shrink-0 left-section w-52 mr-6">
        <div class="h-52 bg-[#1F4099]">
            <img class="w-full h-full" src="@/assets/images/no-video.png" alt="">
        </div>
        <div class="text-sm p-3">
            <div class="text-lg mb-2.5">余杭变电站01号机场</div>
            <div class="flex items-center" v-if="true">
                <span class="text-white opacity-70 mb-1">覆盖线路：</span>
                <span>220KVxx线</span>
            </div>
            <div class="flex items-center">
                <span class="text-white opacity-70">SN：</span>
                <span>312100121</span>
            </div>
        </div>
    </section>
    <section class="flex-1 flex flex-wrap">
        <div 
            v-for="item in buttonList"
            :key="item.id"
            class="flex justify-between bg-[#1F4099]  w-[calc(50%-8px)] items-center px-6 py-5 button-item mt-4"
        >
            <div class="flex items-center">
                <img :src="item.image" class="w-14 h-14 mr-17px" alt="">
                <div>
                    <div class="text-base">{{ item.text }}</div>
                    <div class="text-sm opacity-80">{{ item.name }}</div>
                </div>
            </div>
            <div 
                class="flex cursor-pointer items-center justify-center rounded-3px px-4 h-8 !text-primary border border-solid border-primary"
                @click="eventEmit(item)"
                >
                {{item.buttonText}}
            </div>
        </div>
    </section>
  </section>
</template>
<script setup lang="ts">
import {ref,reactive} from "vue";

const props = defineProps(['detail','buttonList']);
const emits = defineEmits(['onRemote']);

const eventEmit = (item) => {
  emits('onRemote',item);
};


</script>
<style lang="scss" scoped>
@import './remote-item.scss'



</style>
