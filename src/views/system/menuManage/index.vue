<template>
    <div class="flex-1 p-4 bg-deepBlue m-4 text-green">
        <el-button @click="toAdd" style="float: left; margin-bottom: 16px;" type="primary"><el-icon>
                <Plus />
            </el-icon>添加</el-button>
        <el-button @click="toPartDel" style="float: left; margin-bottom: 16px;">
            <el-icon>
                <Delete />
            </el-icon>批量删除
        </el-button>
        <ProTable ref="proTableRef" title="菜单管理列表" :columns="columns" :request-api="apiGetMenuList"
            :data="data" max-height="680" :init-param="initParam" :searchToolButton="false"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />

            <template #operation="{ row }">
                <el-dropdown size="small">
                    <el-button type="primary" link @click="editMenu(row)" class="text-green-900"><i
                            class="iconfont icon-bianji" />
                        编辑 </el-button>
                </el-dropdown>
                <el-dropdown size="small">
                    <el-button type="danger" link class="text-green-900" @click="toDel(row.id)">
                        <el-icon>
                            <Delete />
                        </el-icon>删除</el-button>
                </el-dropdown>
            </template>
        </ProTable>
        <menuDialog ref="menuDialogRef" @refresh="refresh"></menuDialog>
    </div>
</template>
<script setup lang="ts">
import { columns } from './config'
import { ref, reactive,onBeforeMount } from 'vue'
import ProTable from "@/components/ProTable/index.vue";
import menuDialog from './component/menuDialog.vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { apiGetMenuList, apiDelMenu } from '@/api/interface/system/menu'
const proTableRef = ref()
const menuDialogRef = ref()
const selectedList = ref<{ [key: string]: any }[]>([]);
//假数据
const data = [
    {
        menuName: '设备管理',
        menuType: '一级菜单',
        menuIcon: '  line-chart',
        menuComponent: 'layouts/RouteView',
        path: 'idataAnalysis',
        rank: '1',
        id: 1,
        children: [
            {
                menuName: '  版本管理',
                menuType: '菜单',
                menuComponent: 'layouts/RouteView',
                path: 'idataAnalysis/indexAnaly',
                rank: '1',
                id: 2,
            },
            {
                menuName: '设备管理',
                menuType: '菜单',
                menuComponent: 'layouts/RouteView',
                path: 'idataAnalysis/index',
                rank: '2',
                id: 3,
            },
        ],
    },
    {
        menuName: '资产管理',
        menuType: '菜单',
        menuIcon: ' sound',
        menuComponent: 'layouts/RouteView',
        path: '/idataAnalysis/indexAnaly.',
        rank: '2',
        id: 4,
        children: [
            {
                menuName: '  版本管理',
                menuType: '菜单',
                menuComponent: 'layouts/RouteView',
                path: 'idataAnalysis/indexAnaly',
                rank: '1',
                id: 5,
            }]
    },
]
//获取数据
const params = reactive(
    {
        
    }
)
onBeforeMount(() => {
    apiGetMenuList(params)
})
const initParam = reactive({})

//新增
function toAdd() {
    menuDialogRef.value.open()
}
//批量删除
//选择项发生变化
const handleSelectionChange = (val) => {
    selectedList.value = val
}
function toPartDel() {
    ElMessageBox.confirm('确认批量删除', '提示').then(() => {
        let val = selectedList.value //选中的值
        if (val) {
            const deleteList = val.map((item) => {
                return item.id
            })
            apiDelMenu(deleteList).then(() => {
                ElMessage.success('批量删除成功')
            })
        }
    })
}
//删除
function toDel(id: string ) {
    ElMessageBox.confirm('确认删除', '提示').then(() => {
        apiDelMenu({ id }).then(() => {
            ElMessage.success('删除成功')
        })
    })
}
//编辑
function editMenu(row: object) {
    menuDialogRef.value.open(row)
}
//更新
function refresh() {
    proTableRef.value.getTableList()
}
</script>
<style lang="scss" scoped></style>