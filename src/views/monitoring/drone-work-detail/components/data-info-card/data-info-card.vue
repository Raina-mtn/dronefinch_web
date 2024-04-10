<!--
 * @Author: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @Date: 2023-11-13 09:03:59
 * @LastEditors: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @LastEditTime: 2023-12-04 15:10:15
 * @FilePath: \dronefinch_web\src\views\monitoring\drone-work-detail\components\data-info-card\data-info-card.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div v-for="item in list" :key="item.name" class="flex items-center ">
        <img v-if="item.icon" :src="item.icon" class="w-10.5 h-10.5 mr-4" />
        <div class="text-sm">
            <div>{{ item.name }}</div>
            <div>
                <span class="!text-primary text-xl">{{ data[item.prop] }}</span>
                <span class="" v-if="item.unit">{{ item.unit }}</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, inject } from "vue";
interface Props {
    list: any[],
    data:{ [key: string]: any }
}
const props = defineProps<Props>();



</script>
<style lang="scss" scoped>
@import './data-info-card.scss'
</style>
