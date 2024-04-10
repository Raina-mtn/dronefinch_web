<!--
 * @Date: 2023-07-18 08:55:45
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-11-07 13:27:52
 * @FilePath: \dronefinch_web\src\views\equipment-manage\drone-mange\drone-dialog.vue
-->
<script lang="ts" setup>
import { reactive, defineExpose, ref, onBeforeMount } from "vue";
import type { FormInstance } from "element-plus";
import { apiGetDictTree, postDrone, updateDrone } from "@/api/interface/index";

let openResolve: null | ((params: object) => void);
let openReject: null | ((err: Error) => void);

const formDataDefault = {
    dataName: "",
    deviceModel: "",
    deviceSn: "",
    firmwareVersion: "",
};

const state = reactive({
    visible: false,
    loading: true,
    formData: JSON.parse(JSON.stringify(formDataDefault)),
    originData: {},
    droneModelList: <object>[],
    // belongAirportList: <object>[],
});

const formRef = ref<FormInstance>();

onBeforeMount(async () => {
    getBasicData();
});

// 打开
const open = async (data = {}) => {
    return new Promise((resolve, reject) => {
        state.originData = data;
        for (const [k] of Object.entries(state.formData)) {
            if (data[k] !== undefined) {
                state.formData[k] = data[k];
            }
        }

        openResolve = resolve;
        openReject = reject;
        state.visible = true;
    });
};

// 关闭
const close = () => {
    openReject && openReject(new Error("form closed"));
    reset();
};

const reset = () => {
    openResolve = null;
    openReject = null;
    state.formData = JSON.parse(JSON.stringify(formDataDefault));
    formRef.value?.resetFields();
    state.visible = false;
};

const submit = async () => {
    try {
        await formRef.value?.validate();
        let parmas = Object.entries(state.formData).reduce((state, cur) => {
            const [k, v] = cur;
            if (![null, undefined].includes(v)) {
                state[k] = v;
            }
            return state;
        }, {});

        let res;
        const { id } = state.originData as { id: string };
        if (id) {
            res = await updateDrone({ ...parmas, id });
        } else {
            res = await postDrone(parmas);
        }
        openResolve && openResolve(res);
        reset();
    } catch (error) {
        console.log("提交失败");
    }
};

const getBasicData = () => {
    apiGetDictTree({ dictTypeCode: "DRONE_MODEL" }).then((res) => {
        state.droneModelList = res.data.list;
    });

    // getAirportList({ "page.pageIndex": 1, "page.pageSize": 9999 }).then((res) => {
    //     state.belongAirportList = res.data.list;
    // });
};

defineExpose({
    open,
});
</script>

<template>
  <el-dialog
    class="alarm-dailog"
    v-model="state.visible"
    title="飞行器弹框"
    width="fit-content"
    :before-close="close"
  >
    <el-form
      class="alarm-form"
      style=""
      ref="formRef"
      :model="state.formData"
      label-width="150px"
      status-icon
    >
      <el-form-item
        label="飞行器名称"
        prop="dataName"
        style="width: 100%"
        :rules="[
          { required: true, message: '用户名不能为空', trigger: 'change' },
        ]"
      >
        <el-input v-model="state.formData.dataName" />
      </el-form-item>
      <el-form-item
        label="型号"
        prop="deviceModel"
        style="width: 100%"
        :rules="[
          { required: true, message: '型号不能为空', trigger: 'change' },
        ]"
      >
        <el-select
          v-model="state.formData.deviceModel"
          placeholder="请选择型号"
          style="width: 100%"
        >
          <el-option
            v-for="(item, i) in state.droneModelList"
            :key="i"
            :label="item['name']"
            :value="item['code']"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="设备SN"
        prop="deviceSn"
        style="width: 100%"
        :rules="[
          { required: true, message: '设备SN不能为空', trigger: 'change' },
        ]"
      >
        <el-input v-model="state.formData.deviceSn" />
      </el-form-item>
      <el-form-item
        label="固件版本"
        prop="firmwareVersion"
        style="width: 100%"
        :rules="[{ required: true, message: '固件版本不能为空' }]"
      >
        <el-input v-model="state.formData.firmwareVersion" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scope>
.alarm-dailog {
  .alarm-form {
    width: 800px;
    display: flex;
    flex-wrap: wrap;

    .ableUseLastTime {
      display: flex;
    }
  }
}
</style>
