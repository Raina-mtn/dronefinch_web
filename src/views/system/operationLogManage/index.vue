<template>
    <div class="flex-1 p-4 bg-deepBlue m-4 text-green">
        <ProTable ref="proTableRef" title="操作日志列表" :columns="columns" :request-api="(params) => getLogList(params)"
            max-height="680" :searchToolButton="false">
        </ProTable>
    </div>
</template>
<script setup lang="ts">
import { columns } from './config'
import { ref, reactive } from 'vue'
import { apiGetLog } from '@/api/interface/system/log'
import ProTable from "@/components/ProTable/index.vue";

function getLogList(params: any){
    let newParams = JSON.parse(JSON.stringify(params));
  newParams.accessTime && (newParams.minAccessTime = newParams.accessTime[0]);
  newParams.accessTime && (newParams.maxAccessTime = newParams.accessTime[1]);
  delete newParams.accessTime;
  console.log(newParams);
  
  return apiGetLog(newParams);
}


</script>
<style lang="scss" scoped></style>