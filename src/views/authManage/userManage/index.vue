<template>
    <div class="flex h-full p-4">
        <OrgTree></OrgTree>
        <div class="flex-1 p-4 bg-deepBlue ml-4 text-green">
            <ProTable ref="proTableRef" :columns="columns" :request-api="apiGetUserList"
                :init-param="initParam" title="用户列表" :searchToolButton="false" :search-col="4" > 
                <template #searchBottom>
                    <el-form-item>
                        <el-button @click="addUser" style="float: left; margin-bottom: 16px;" type="primary"><el-icon>
                                <Plus />
                            </el-icon>添加用户</el-button>
                    </el-form-item>
                </template>
                <!-- 操作 -->
                <template #operation="{ row }">
                    <el-dropdown size="small">
                        <el-button type="primary" link @click="editUser(row)" class="text-green-900"><i
                                class="iconfont icon-bianji" />
                            编辑 </el-button>
                    </el-dropdown>
                    <el-dropdown size="small">
                        <el-button type="primary" link class="text-green-900">
                            <el-icon>
                                <MoreFilled />
                            </el-icon>更多
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="openDetails(row)">详情</el-dropdown-item>
                                <el-dropdown-item @click="resetPassword(row.id)">重置密码</el-dropdown-item>
                                <el-dropdown-item @click="freezeAccount(row)">{{ !ifLock(row) ? '冻结' : '解冻' }}</el-dropdown-item>
                                <el-dropdown-item @click="toDelete( row.id )">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </ProTable>
        </div>
        <UserDialog ref="userDialogRef" @refresh="refresh" />
        <PasswordDialog ref="passwordDialogRef"></PasswordDialog>
    </div>
</template>
<script setup lang="ts">
import OrgTree from "./component/OrgTree.vue";
import ProTable from "@/components/ProTable/index.vue";
import { ref, reactive ,onBeforeMount} from 'vue'
import { columns, ifLock } from './config'
import { apiGetUserList, apiDelUser, apiLockUser, apiUnlockUser, apiExportList } from '@/api/interface/auth/user'
import UserDialog from './component/UserDialog.vue'
import PasswordDialog from './component/PasswordDialog.vue'
import { ElMessageBox, ElMessage } from "element-plus";
import dayjs from "dayjs";

const initParam = reactive({})
const userDialogRef = ref()
const passwordDialogRef = ref()
const proTableRef = ref()
const page = reactive({
    pageIndex:1,
    pageSize:10
})
//获取表格数据
onBeforeMount(()=>{
    apiGetUserList({page}) 
}) 

//编辑
function editUser(scope) {
    userDialogRef.value.open(scope, true)
}
//添加用户信息
function addUser() {
    userDialogRef.value.open({})
}
//查看详情
function openDetails(scope) {
    userDialogRef.value.open(scope,false,true,true)
}
//导出用户信息
function exportUser() {
    // const params={ id:from.id }
    ElMessageBox.confirm('确认导出该文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        ElMessage({
            type: 'success',
            message: '导出成功',
        })
        // console.log('params :>> ', params);
        // apiExportList({url, params})
    })
}
//重置密码
function resetPassword(id:string) {
    passwordDialogRef.value.open(id)
}
//冻结
function freezeAccount(row: { username: string, lastLockedTime: null | string }) {
    const msg = ifLock(row) ? '解冻' : '冻结'
    const lockDay = dayjs().add(1, 'year')
    ElMessageBox.confirm(`确认${msg}该用户`, ' 提示').then(() => {
        const api = msg === '冻结' ? apiLockUser : apiUnlockUser
        const params = Object.assign({
            username: row.username,
        }, msg === '冻结' ? { duration: lockDay.diff(dayjs(), 's') } : {})
        api(params).then(() => {
            ElMessage.success(`已${msg}`)
            refresh()
        })
    })
}
//删除-更多
function toDelete( id: string ) {
  ElMessageBox.confirm('确认删除', ' 提示').then(() => {
    apiDelUser({ id }).then(() => {
      ElMessage.success('删除成功')
      refresh()
    })
  })
}
function refresh() {
    proTableRef.value.getTableList()
}
</script>
<style lang="scss"></style>