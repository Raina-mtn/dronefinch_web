<template>
    <el-dialog v-model="dialogFormVisible" title="重置密码" width="30%">
        <el-form :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="form.oldPassword" autocomplete="off" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="form.newPassword" autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
        
<script setup lang='ts'>
import { ref,reactive } from 'vue';
import { apiUpdatePass } from '@/api/interface/auth/user'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['refresh'])
const dialogFormVisible = ref(false)
const id = ref()
const form = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const ruleFormRef = ref()
//打开
function open(nowId: number) {
    dialogFormVisible.value = true
    id.value = nowId
    reset()
}
function reset() {
    ruleFormRef.value && ruleFormRef.value.resetFields()
}
defineExpose({
    open
})
//rule规则
const check = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@;:])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@;:])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@;:]))/;
const validateOldPassword = (_rule: any, value: any, callback: any) => {
    if (value.length < 8) {
        callback(new Error("用户密码不得小于8位"));
    } else if (!check.test(value)) {
        callback(new Error("密码应为大写字母、小写字母、数字、特殊字符中三种或三种以上的组合"));
    } else {
        callback();
    }
};
const validateNewPassword = (_rule: any, value: any, callback: any) => {
    if (value.length < 8) {
        callback(new Error("用户密码不得小于8位"));
    } else if (!check.test(value)) {
        callback(new Error("密码应为大写字母、小写字母、数字、特殊字符中三种或三种以上的组合"));
    } else {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validateField('newPassword2', () => null)
    }
    callback();
};
const validateConfirmPassword = (_rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
    } else {
        callback();
    }
};
const rules = reactive({
    oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'change' },
        { validator: validateOldPassword, trigger: 'change' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'change' },
        { validator: validateNewPassword, trigger: 'change' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'change' },
        { validator: validateConfirmPassword, trigger: 'change' }
    ],
})
//提交
async function submit(){
    if (!ruleFormRef.value) return
    const valid = await ruleFormRef.value.validate()
    if (valid) {
        const params = { id:id.value, needCheckOldPass: true, oldPassword: form.oldPassword, newPassword: form.newPassword }
        apiUpdatePass(params).then(() => {
            ElMessage.success('修改成功')
            dialogFormVisible.value = false
            emits('refresh')
        })
    }
}
</script>
        
<style></style>