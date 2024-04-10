<template>
    <el-dialog v-model="dialogFormVisible"
        :title="`${isEdit ? '编辑' : '添加'}字典`" width="30%">
        <el-form label-width="120px" ref="ruleFormRef" :model="form" :rules="rules">
            <el-form-item label="字典名称" prop="name" required>
                <el-input v-model="form.name" maxlength="30" />
            </el-form-item>
            <el-form-item label="字典标识" prop="identify" maxlength="10">
                <el-input v-model="form.identify" type="textarea" maxlength="250" />
            </el-form-item>
            <el-form-item label="是否启用" prop="state" maxlength="10">
                <el-switch v-model="ifState" />
            </el-form-item>
            <el-form-item label="描述" prop="describe" maxlength="10">
                <el-input v-model="form.describe" type="textarea" maxlength="250" />
            </el-form-item>
            
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref ,reactive} from 'vue';
const dialogFormVisible = ref(false)
const isEdit = ref(true)
const ruleFormRef = ref()
const ifState = ref()
const form = ref({
    name: '',
    identify: '',
    state:'',
    describe:''
})
const rules = reactive({
    name: [{ required: true, message: '字典名称必填', trigger: 'blur' }],
    identify: [{ required: true, message: '字典标识必填', trigger: 'blur' }],
})
//打开
function open(scope, isEdit: boolean){    
    ruleFormRef.value?.resetFields()
    dialogFormVisible.value = true 
    isEdit = isEdit   
    form.value = { ...scope }
    // console.log("form.value.state>>>>>>>>>>",form.value.state);
    ifState.value = form.value.state == '启用' ? true : false
    // console.log('ifState.value>>>>>>>>>',ifState.value);
    
    
}
defineExpose({
    open,
    ifState
})

//提交
function submit(){

}
</script>
<style lang="scss"></style>