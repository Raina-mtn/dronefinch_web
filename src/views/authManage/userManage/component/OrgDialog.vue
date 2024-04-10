<template>
    <el-dialog v-model="dialogFormVisible"
        :title="`${state.isEdit ? '编辑部门' : (isLook ? '查看部门' : (primaryOrg ? '添加一级组织' : '添加子组织'))}`" width="30%">
        <el-form label-width="120px" ref="ruleFormRef" :model="form" :rules="rules">
            <el-form-item label="部门名称" prop="name" required>
                <el-input v-model="form.name" maxlength="30" />
            </el-form-item>
            <el-form-item label="上级部门" prop="parentId" v-show="showParent">
                <el-tree-select v-model="form.parentId" :data="state.orgTreeData" :render-after-expand="false" check-on-click-node
                    check-strictly node-key="id" class="!w-full" />
            </el-form-item>
            <el-form-item label="负责人" prop="charger">
                <el-select v-model="form.charger" clearable style="width:100%">
                    <el-option v-for="item in userList" :key="item.id" :label="item.username" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="memo" maxlength="10">
                <el-input v-model="form.memo" type="textarea" maxlength="250" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">关闭</el-button>
                <el-button type="primary" @click="submit">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref,reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { Tree } from '@/components/Tree/interface';
import { apiGetUserList } from '@/api/interface/auth/user'
import { ElMessage } from 'element-plus'
import { apiCreateOrg, apiUpdateOrg } from '@/api/interface/auth/org'

const refresh = defineEmits(['refresh'])
const dialogFormVisible = ref(false)
const isLook = ref(false)
const state = reactive({
    isEdit: false,
    orgTreeData: [] as Tree[],
})
const primaryOrg = ref(false)
const userList = ref([])
const showParent = ref(true)
const form = ref<any>({
    name: '',
    parentId:''
})
const ruleFormRef = ref<FormInstance>()
const rules = ref<FormRules>({ // 去掉org 的page属性
    name: [
        { required: true, message: '部门名称必填', trigger: 'blur' },
    ],
})
//打开
function open(orgTreeData: Tree[], isEdit: boolean, formData: Node & { parentId?: number, charger?: string }) {
    ruleFormRef.value?.resetFields()
    dialogFormVisible.value = true
    state.isEdit = isEdit
    state.orgTreeData = orgTreeData
    form.value = formData ? { ...formData, name: formData?.label, parentId: formData?.parentId === 0 ? 0 : formData.parentId, charger: formData.charger ? Number(formData.charger) : '' } : { name: '', parentId: '' }
    getUserList()
}
defineExpose({
    open,
    showParent
})
//获取负责人列表
function getUserList() {
    const params = {
        page: {
            pageIndex: 1,
            pageSize: 1000
        }
    }
    apiGetUserList(params).then(res => {
        userList.value = res.data.list
    })
}
//提交
async function submit() {
    if (!ruleFormRef.value) return
    if (state.isEdit && form.value.id === form.value.parentId) {
        return ElMessage.error('上级部门不能为当前选中的部门')
    }
    const valid = await ruleFormRef.value.validate()
    if (valid) {
        const api = state.isEdit ? apiUpdateOrg : apiCreateOrg
        api(form.value).then(() => {
            ElMessage.success(state.isEdit ? '编辑成功' : '创建成功')
            dialogFormVisible.value = false
            refresh('refresh')
        })
    }
}
</script>
<style lang="scss"></style>