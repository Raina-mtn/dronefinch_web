<template>
    <ProTable ref="proTableRef" title="字典管理列表" :columns="leftColumns" :request-api="apiGetDictionaryList" max-height="680"
        :searchToolButton="false" :data="data" @current-change="handleCurrentChange" highlight-current-row>
        <template #searchBottom>
            <el-form-item>
                <el-button type="primary" @click="addDictionary" style="float: left; margin-bottom: 16px;"><el-icon>
                        <Plus />
                    </el-icon>新增</el-button>

                <el-button type="primary" @click="editDictionary" style="float: left; margin-bottom: 16px;"><el-icon>
                        <Edit />
                    </el-icon>编辑</el-button>

                <el-button type="primary" @click="delDictionary(nowData.id)"
                    style="float: left; margin-bottom: 16px;"><el-icon>
                        <Delete />
                    </el-icon>删除</el-button>
            </el-form-item>
        </template>
    </ProTable>
    <DictionaryDialog ref="dictionaryDialogRef"></DictionaryDialog>
</template>
<script setup lang="ts">
import { leftColumns } from '../config'
import ProTable from "@/components/ProTable/index.vue";
import { ref, reactive, onBeforeMount } from 'vue'
import DictionaryDialog from './dictionaryDialog.vue'
import { apiGetDictionaryList, apiDelDictionary } from '@/api/interface/system/dictionary'
import { ElMessageBox, ElMessage } from "element-plus";

const data = reactive([
    {
        name: 0,
        state: '启用',
        id: 0
    },
    {
        name: 1,
        state: '禁用',
        id: 1

    },
    {
        name: 2,
        state: '启用',
        id: 0

    }
])
const nowData = ref()
const proTableRef = ref()
const dictionaryDialogRef = ref()
const params = reactive(
    {
        
    }
)
onBeforeMount(() => {
    apiGetDictionaryList(params)
})


//新增
function addDictionary() {
    dictionaryDialogRef.value.open()
}
//编辑
function editDictionary() {
    dictionaryDialogRef.value.open(nowData.value)
}
//删除
function delDictionary(id: string) {
    ElMessageBox.confirm('确认删除', ' 提示').then(() => {
        apiDelDictionary({ id }).then(() => {
            ElMessage.success('删除成功')
            refresh()
        })
    })
}
function refresh() {
    proTableRef.value.getTableList()
}
//当前行发生变化的数据
function handleCurrentChange(val) {

    console.log("当前行数据", val);
    nowData.value = val
}
defineExpose({
    nowData
})


</script>
<style scoped lang="scss">
// ::v-deep {
//     .current-row {
//         background-color: red !important;
//     }
// }
</style>