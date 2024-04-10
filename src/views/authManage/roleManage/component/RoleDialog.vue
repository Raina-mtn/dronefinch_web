<template>
    <el-dialog v-model="state.dialogVisible" :title="`${state.isEdit ? '编辑' : '添加'}角色`" width="30%">
        <el-form label-width="120px" :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="form.roleName" maxlength="30"  placeholder="请输入"/>
            </el-form-item>
            <el-form-item label="角色类别" prop="roleType">
                <el-select v-model="form.roleType" placeholder="请选择"  style="width: 100%">
                    <el-option label="功能角色" value="1"></el-option>
                    <el-option label="区域二" value="2"></el-option>
                </el-select>
                <!-- <el-select v-model="form.roleType" placeholder="请选择"  style="width: 100%">
                    <el-option v-for="item in state.roleTypeList" :key="item.id" :label="item.username" :value="item.id" />
                </el-select> -->
            </el-form-item>
            <el-form-item label="描述" prop="roleDesc">
                <el-input type="textarea" v-model="form.roleDesc" placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="state.dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
        
<script setup lang='ts'>
import { reactive, ref } from 'vue';
import { Role } from '@/api/interface/types'
import type { FormInstance } from 'element-plus'
import { apiCreateRole, apiUpdateRole } from '@/api/interface/auth/role';
import { ElMessage } from 'element-plus'

const emits = defineEmits(['refresh'])
const ruleFormRef = ref<FormInstance>()
const rules = reactive({
    roleName: [
        { required: true, message: '用户名称必填', trigger: 'blur' },
    ],
    roleType: [
        { required: false, message: '角色类别必填', trigger: 'blur' },
    ],
    roleDesc: [
        { message: '角色类别必填', trigger: 'blur' },
    ],
})


const state = reactive({
    dialogVisible: false,
    isEdit: false,
    roleTypeList:[]
})

const form = ref({
    roleName: '',
    roleDesc: '',
    roleType: ''
})

function getRoleTypeList() {
    const params = {
        page: {
            pageIndex: 1,
            pageSize: 9999
        }
    }
    apiGetRoleTypeList(params).then(res => {
        state.roleTypeList = res.data.list
    })
}

function open(scope: Role.ReqUserParams, isEdit: boolean) {
    ruleFormRef.value?.resetFields()
    state.dialogVisible = true
    state.isEdit = isEdit
    form.value = scope ? { ...scope } : { roleName: '' }
    getRoleTypeList()
}

async function submit() {

    if (!ruleFormRef.value) return
    const valid = await ruleFormRef.value.validate()
    if (valid) {
        const api = state.isEdit ? apiUpdateRole : apiCreateRole
        api(form.value).then(() => {
            ElMessage.success(state.isEdit ? '编辑成功' : '创建成功')
            state.dialogVisible = false
            emits('refresh')
        })
    }
}

defineExpose({
    open
})
</script>
        
<style></style>