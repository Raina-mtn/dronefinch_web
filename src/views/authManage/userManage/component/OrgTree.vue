<template>
    <BasicTree :title="'部门搜索'" class="org-tree" :treeData="orgTreeData" :node-key="'id'" :filter-node-method="filterNode"
        :default-expanded-keys="[0]" :placeholder="'请输入部门名称'">
        <template #checkRow="scope">
            <div class="flex justify-between check-row">
                <p class="text-white truncate">当前选中：<span class="text-sm" :title="scope.label">{{ scope.label }}</span></p>
                <span style="flex: 0 0 140px" v-show="true">
                    <el-button type="primary" link @click="lookOrg(scope as unknown as Node)" :disabled="scope.id === 0"> 查看
                    </el-button>
                    <el-button type="primary" link @click="editOrg(scope as unknown as Node)" :disabled="scope.id === 0"> 编辑
                    </el-button>
                    <el-button type="danger" link @click="delOrg(scope)" :disabled="scope.id === 0"> 删除
                    </el-button>
                </span>
            </div>
        </template>
        <template #other>
            <div class="orgButton">
                <el-button type="primary" @click="createOrg()" style="width: 50%;"><el-icon>
                        <CirclePlus />
                    </el-icon>添加子组织</el-button>
                <el-button type="primary" @click="createPrimaryOrg()" style="width: 50%;"><el-icon>
                        <CirclePlus />
                    </el-icon>添加一级组织</el-button>
            </div>

        </template>
    </BasicTree>
    <OrgDialog @refresh="refresh" ref="orgDialogRef"></OrgDialog>
</template>
<script setup lang="ts">
import BasicTree from '@/components/Tree/BasicTree.vue'
import { ref } from 'vue';
import { apiGetOrgTree, apiDelOrg } from '@/api/interface/auth/org';
import { Tree } from '@/components/Tree/interface'
import { ElMessage, ElMessageBox } from 'element-plus'
import OrgDialog from './OrgDialog.vue';

const orgDialogRef = ref()
const orgTreeData = ref<Tree[]>([])
//获取数据
getOrgTree()
function getOrgTree() {
    apiGetOrgTree().then(res => {
        orgTreeData.value = [
            {
                id: 0,
                children: res.data,
                label: '全部'
            }
        ]
    })
}
// 添加子组织
function createOrg() {
    orgDialogRef.value.showParent = true
    orgDialogRef.value.open(orgTreeData.value, false)
}
//添加一级组织
function createPrimaryOrg() {
    orgDialogRef.value.showParent = false
    orgDialogRef.value.open(orgTreeData.value,false)   
}
//查看
function lookOrg(scope: Node) {
    orgDialogRef.value.showParent = true
    orgDialogRef.value.open(orgTreeData.value, true, scope)
}
//编辑
function editOrg(scope: Node) {
    orgDialogRef.value.showParent = true
    orgDialogRef.value.open(orgTreeData.value, true, scope)
}
//筛选执行的方法
interface TreeNode {
  [key: string]: any
}
const filterNode = (value: string, data: TreeNode) => {
  if (!value) return true
  return data.label.includes(value)
}
//删除
function delOrg(scope: { children?: [], id: number | undefined }) {
    let message = ''
    if (scope && scope.children) {
        message = '该部门下存在下级部门,确认删除吗？'
    } else {
        message = '确认删除该部门吗？'
    }
    ElMessageBox.confirm(message, '提示').then(() => {
        const params = {
            idList: [scope.id],
            enableCascade: true
        }
        apiDelOrg(params).then(() => {
            ElMessage.success('删除成功')
            getOrgTree()
        })
    })
}
//更新列表
function refresh() {
    getOrgTree()
}

</script>
<style lang="scss">
.org-tree {
    width: 378px;
    // flex: 0 0 378px;
}

.check-row {
    background: #1B3D9F;
    line-height: 32px;
    height: 32px;
    margin-bottom: 1rem;

    p {
        color: #fff;
        padding: 0 10px;
    }
}

.orgButton {
    display: flex;
    justify-content: space-between;
}
</style>