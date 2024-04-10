<template>
    <el-dialog :title="`${state.isEdit ? '编辑' : '新增'}菜单`" v-model="state.dialogFormVisible" width="25%">
        <el-form :model="form" label-width="120px" center :rules="rules" ref="ruleFormRef">
            <el-form-item label="菜单类型" prop="menuType">
                <el-checkbox-group v-model="form.menuType" :max="1">
                    <el-checkbox v-for="item in menuTypeList" :key="item" :label="item">

                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="菜单名称" prop="menuName">
                <el-select v-model="form.menuName" placeholder="请选择" style="width: 100%">
                </el-select>
            </el-form-item>
            <el-form-item label="菜单路径" prop="path">
                <el-input v-model="form.path" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="前端组件" prop="menuComponent">
                <el-input v-model="form.menuComponent" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="默认跳转地址" prop="defaultPath">
                <el-input v-model="form.defaultPath" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" prop="menuIcon">
                <el-input v-model="form.menuIcon" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="rank">
                <el-input v-model="form.rank" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="是否路由菜单" prop="ifRouterMenu">
                <el-switch v-model="form.ifRouterMenu" />
            </el-form-item>
            <el-form-item label="隐藏路由" prop="hiddenRouter">
                <el-switch v-model="form.hiddenRouter" />
            </el-form-item>
            <el-form-item label="是否缓存路由" prop="cacheRouter">
                <el-switch v-model="form.cacheRouter" />
            </el-form-item>
            <el-form-item label="聚合路由" prop="groupRouter">
                <el-switch v-model="form.groupRouter" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="state.dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang='ts'>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus'

const state = reactive({
    dialogFormVisible: false,
    isEdit: false
})
const refreshFrom = defineEmits(['refresh'])
const form = ref({
    menuType: '',
    menuName: '',
    path: '',
    menuComponent: '',
    defaultPath: '',
    menuIcon: '',
    rank: '',
    ifRouterMenu:'',
    hiddenRouter:'',
    cacheRouter:'',
    groupRouter:'',
})
//假数据
const menuTypeList = ['一级菜单','子菜单','按钮/权限']
const ruleFormRef = ref()
//表单验证
const rules = ref({
    menuType: [{ required: true, message: '菜单类型必选', trigger: 'blur' }],
    menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
    menuComponent: [{ required: true, message: '请输入前端组件', trigger: 'blur' }],
})
//打开
function open(scope, isEdit: boolean) {
    ruleFormRef.value?.resetFields()
    state.dialogFormVisible = true
    state.isEdit = isEdit
    form.value = scope ? { ...scope } : { menuName: '' }
}

defineExpose({
    open
})
//提交
async function submit() {
    if (!ruleFormRef.value) return
    const valid = ruleFormRef.value.validate()
    if (valid) {
        const api = state.isEdit ? apiUpdateMenu : apiCreateMenu
        api(form.value).then(() => {
                ElMessage.success(state.isEdit ? '编辑成功' : '创建成功')
                state.dialogFormVisible = false
                refreshFrom('refresh')
        })
    }
}
</script>