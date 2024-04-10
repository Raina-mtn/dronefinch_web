<template>
    <el-scrollbar class="timeline-box h-full">
        <el-timeline class="p-6 pb-1">
            <el-timeline-item
            v-for="(activity, index) in list"
                :key="index"
                :timestamp="activity.log_time"
            >
            {{ activity.log_name }}
            <template #dot>
                <img  class="w-8 h-8 dot-icon" :src="list.length === index+1 ? timelineWait : timelineFinished">
            </template>
            </el-timeline-item>
        </el-timeline>
    </el-scrollbar>
</template>
<script setup lang="ts">
import {ref,reactive} from "vue";
import timelineFinished from '@images/timeline-finished.png';
import timelineWait from '@images/timeline-wait.png';

const props = defineProps(['list']);



</script>
<style lang="scss" scoped>
@import './task-log-card.scss'



</style>
