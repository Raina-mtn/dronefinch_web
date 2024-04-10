<template>
    <!-- :title="`${state.isEdit ? '编辑用户' :(state.isLook? '查看详情':'新增用户')}` -->
    <el-dialog v-model="state.dialogFormVisible" :title="`${state.isEdit ? '编辑用户' : (state.isLook ? '查看详情' : '新增用户')}`"
        width="25%">
        <el-form :model="form" label-width="120px" label-position="right" :rules="rules" ref="ruleFormRef" :disabled="state.disabled">
            <el-form-item label="姓名" prop="username" placeholder="请输入">
                <el-input v-model="form.username" autocomplete="off" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile" placeholder="请输入">
                <el-input v-model="form.mobile" autocomplete="off" />
            </el-form-item>
            <el-form-item label="所属部门" prop="deptId" placeholder="请输入">
                <el-select v-model="form.deptId" placeholder="请选择" style="width: 100%;">
                    <el-option :label="item.label" :value="item.id" v-for="item in state.orgTreeData" :key="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="角色分配" prop="roleId">
                <el-select v-model="form.roleId" placeholder="请选择" style="width: 100%;">
                    <el-option :label="item.roleName" :value="item.id" v-for="item in state.roleList" :key="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="登录密码" prop="password" v-if="!state.isEdit">
                <el-input v-model="form.password" type="password" show-password :disabled="state.isEdit">
                </el-input>
            </el-form-item>
            <!-- <el-form-item label="确认密码" prop="againPwd" v-if="!state.isEdit">
                <el-input v-model.trim="form.againPwd" type="password" show-password></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="安全U盾密码" prop="uCode" style="position: relative;">
                <UsbCode v-model:value="form.ucode"></UsbCode>
            </el-form-item> -->
            <el-form-item label="邮箱" prop="email" placeholder="请输入">
                <el-input v-model="form.email" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="state.dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, PropType,onBeforeMount } from 'vue';
import { User, Role } from '@/api/interface/types'
import type { FormRules, FormInstance } from 'element-plus'
import { checkPhone, checkEmail } from '../config'
import { apiGetRoleList, apiGetOrgTree, apiCreateUser, apiUpdateUser } from '@/api/interface';
import { ElMessage } from 'element-plus'
// import UsbCode from '@/components/UsbCode/index.vue'
const refresh = defineEmits(['refresh'])
const state = reactive({
    dialogFormVisible: false,
    isEdit: false,
    isLook: false,
    roleList: [] as unknown as PropType<Omit<Role.ReqUserParams, 'page'>[]>,
    orgTreeData: [],
    disabled:false
})
const form = ref<Omit<User.ReqUserParams, 'page'>>({
    username: '',
    mobile: '',
    deptId: '',
    roleId: '',
    email: '',
    password: '',
    ucode: ''
})
const check = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@;:])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@;:])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@;:]))/;
const ruleFormRef = ref<FormInstance>()
    const validatePassword = (_rule: any, value: any, callback: any) => {

if (value === "") {
    callback(new Error("请输入密码"));
} else if (value.length < 8) {
    callback(new Error("用户密码不得小于8位"));
} else if (value.length > 20) {
    callback(new Error("用户密码不得大于20位"));
} else if (!check.test(value)) {
    callback(new Error("密码应为大写字母、小写字母、数字、特殊字符中三种或三种以上的组合"));
} else {
    callback();
}
};
const validatePass2 = (_rule: any, value: any, callback: any) => {
if (value === '') {
    callback(new Error('请再次输入密码'));
} else if (value.length < 8) {
    callback(new Error("用户密码不得小于8位"));
} else if (value.length > 20) {
    callback(new Error("用户密码不得大于20位"));
} else if (!check.test(value)) {
    callback(new Error("密码应为大写字母、小写字母、数字、特殊字符中三种或三种以上的组合"));
} else if (value !== form.value.password) {
    callback(new Error('两次输入密码不一致!'));
} else {
    callback();
}
};
const rules = reactive<FormRules<Omit<User.ReqUserParams, 'page'>>>({
    username: [{ required: true, message: '用户名称必填', trigger: 'blur' }],
    mobile: [{ required: true, message: '手机号必填', trigger: 'blur' },
    { validator: checkPhone, message: '请输入正确的手机号', trigger: 'change' }],
    deptId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
    roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
    email: [{ validator: checkEmail, message: '请输入正确的邮箱', trigger: 'change' }],
    password: [
        { required: true, message: '密码必填', trigger: 'blur' },
        { validator: validatePassword, trigger: 'change' },
    ],
    againPwd: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
    ],
})
//获取角色、部门下拉框数据 
function getAllData() {
    apiGetRoleList({ page: { pageIndex: 1, pageSize: 999 } }).then(res => {
        state.roleList = res.data?.list || []       
    })
    apiGetOrgTree().then(res => {
        state.orgTreeData = res.data
        console.log(state.orgTreeData);     
    })
}
onBeforeMount(()=>getAllData())
    

//打开页面获取数据
function open(scope: User.UserResponse, isEdit: boolean, isLook: boolean,disabled:boolean) {
    getAllData()
    ruleFormRef.value?.resetFields()
    state.dialogFormVisible = true
    state.isEdit = isEdit
    state.isLook = isLook
    state.disabled = disabled
    form.value = {
        username: scope?.username || '',
        deptId: scope?.deptId || '',
        //roleId: scope.roleId || '',
        roleId: Array.isArray(scope.roleList) ? scope.roleList[0]?.roleName : '',
        mobile: scope?.mobile || '',
        id: scope?.id,
        email: scope?.email || '',
        password: scope?.password || '',
    }
}
//暴露方法
defineExpose({
    open
})
//新增、编辑、查看详情 提交
async function submit() {
    if(state.isLook){
        state.dialogFormVisible = false
        }
    if (!ruleFormRef.value) return
     await ruleFormRef.value.validate((valid) => {
        if (valid) {

            const api = state.isEdit ? apiUpdateUser : apiCreateUser
            if(state.isEdit){
                delete form.value.password 
            } 
            
            api(form.value).then(() => {
                ElMessage.success(state.isEdit ? '编辑成功' : '创建成功')
                state.dialogFormVisible = false
                refresh('refresh')
            })
        }
    })
}
</script>
<style lang="scss"></style>