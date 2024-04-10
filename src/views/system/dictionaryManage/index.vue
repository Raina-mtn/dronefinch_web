<template>
    <div class="flex h-full p-4">
        <div class="flex-1 p-4 bg-deepBlue ml-4 text-green">
            <Dictionary ref="dictionaryRef"></Dictionary>
          </div>
        <div class="flex-1 p-4 bg-deepBlue ml-4 text-green">
            <ProTable ref="proTableRef" title="字典项管理列表" :columns="itemColumns"
                :request-api="apiGetDictionaryItemList" max-height="680" :searchToolButton="false"
                :data="data">
                <template #searchBottom>
                    <el-form-item>
                        <el-button type="primary" @click="addDictionary" style="float: left; margin-bottom: 16px;"><el-icon>
                                <Plus />
                            </el-icon>新增</el-button>
                    </el-form-item>
                </template>
                <template #operation="{ row }">
                    <el-button type="primary" link @click="editDictionary(row)"><el-icon><Edit /></el-icon>编辑 </el-button>         
                    <el-button type="danger" link @click="del(row.id)"><el-icon><Delete /></el-icon>删除 </el-button>
                </template>
            </ProTable>
            <DictionaryDialog ref="dictionaryItemDialogRef"></DictionaryDialog>
        </div>
    </div>
</template>
<script setup lang="ts">

// import { leftColumns } from './config'
import Dictionary from './component/dictionary.vue'
import ProTable from "@/components/ProTable/index.vue";
import { ref, reactive,onBeforeMount } from 'vue'
import DictionaryDialog from './component/dictionaryDialog.vue'
import { itemColumns } from './config'
import {apiGetDictionaryItemList,apiDelDictionaryItem} from '@/api/interface/system/dictionary'
import { ElMessageBox, ElMessage } from "element-plus";

//假数据
const data = reactive([
    {
        name: '小红',
        identify: '1234567890',
        state: '启用',       
    },
    {
        name: '小名',
        identify: '1234567',
        state: '禁用',
    
    },
    {
        name: '小小',
        identify: '1234567890',
        state: '启用',
  
    },
])
const dictionaryItemDialogRef = ref()
const proTableRef = ref()
const dictionaryRef = ref()
const params = reactive({
    pageIndex:1,
    pageSize:10
})
//获取数据
onBeforeMount(() =>{
    console.log('子组件传递的值',dictionaryRef.value.nowData);
    apiGetDictionaryItemList(params)
})
//添加
function addDictionary() { 
    dictionaryItemDialogRef.value.open()
}
//编辑
function editDictionary(row: object) {
    dictionaryItemDialogRef.value.open(row)
}
//删除
function del(id: string ) {
    ElMessageBox.confirm('确认删除', ' 提示').then(() => {
        apiDelDictionaryItem({ id }).then(() => {
            ElMessage.success('删除成功')
            refresh()
        })
    })
}
function refresh() {
    proTableRef.value.getTableList()
}
</script>
<style lang="scss" scoped></style>