<!--
 * @Date: 2023-07-18 08:55:45
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-11-07 11:07:05
 * @FilePath: \dronefinch_web\src\views\equipment-manage\alramConfig\alarm-dialog.vue
-->
<script lang="ts" setup>
import { reactive, defineExpose, ref, onBeforeMount, watch } from "vue";
import type { FormInstance } from "element-plus";
import {
  apiGetDictTree,
  getDevicePartsTree,
  postConfigAlarm,
  updateConfigAlarm,
  getConfigAlarm,
} from "@/api/interface/index";

let openResolve: null | ((params: object) => void);
let openReject: null | ((err: Error) => void);

const formDataDefault = {
  detectType: "",
  warnLowerThreshold: null,
  warnUpperThreshold: null,
  generalLowerThreshold: null,
  generalUpperThreshold: null,
  criticalLowerThreshold: null,
  criticalUpperThreshold: null,
  effectType: "0",
  effectList: [],
};

const state = reactive({
  visible: false,
  loading: true,
  formData: JSON.parse(JSON.stringify(formDataDefault)),
  originData: {},
  detectTypeOptions: <object>[],
  effectTypeTree: [],
  effectTypeRadio: <object>[],
});

const formRef = ref<FormInstance>();

onBeforeMount(async () => {
  getBasicData();
});

// 打开
const open = async (row = {}) => {
  return new Promise((resolve, reject) => {
    if (row["id"]) {
      getConfigAlarm(row["id"]).then(({ data }) => {
        state.originData = data;
        for (const [k] of Object.entries(state.formData)) {
          if (data[k] !== undefined) {
            state.formData[k] = data[k];
          }
        }
      });
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

    parmas["effectList"] = getEffectTypeList();
    let res;
    const { id } = state.originData as { id: string };
    if (id) {
      res = await updateConfigAlarm({ ...parmas, id });
    } else {
      res = await postConfigAlarm(parmas);
    }

    // let res;
    openResolve && openResolve(res);
    reset();
  } catch (error) {
    console.log("提交失败");
  }
};

const getBasicData = () => {
  apiGetDictTree({ dictTypeCode: "PARTS_DETECT_TYPE" }).then((res) => {
    state.detectTypeOptions = res.data.list;
  });

  getDevicePartsTree().then((res) => {
    state.effectTypeTree = res.data;
  });

  apiGetDictTree({ dictTypeCode: "CONFIG_EFFECT_TYPE" }).then((res) => {
    state.effectTypeRadio = res.data.list;
  });
};

const treeRef = ref();

const getEffectTypeList = () => {
  const keys = treeRef.value
    .getCheckedNodes(false, true)
    .map((item) => item.id);
  let list = state.effectTypeTree.reduce(
    (state, cur: { children: []; id: string }) => {
      if (keys.includes(cur.id)) {
        const newItem = {
          lineId: cur.id,
          partsList: cur.children.reduce((state, curChild: { id: string }) => {
            if (keys.includes(curChild.id)) {
              state.push(curChild.id);
            }
            return state;
          }, [] as Array<string>),
        };
        state.push(newItem);
      }
      return state;
    },
    [] as Array<object>,
  );
  return list;
};

const flatEeffectTypeList = (list) => {
  return list.reduce((state, {id, children = []}) => {
    state.push(id);
    if (children.length){
      const keys = flatEeffectTypeList(children);
      state = [...state, ...keys];
    }
    return state;
  }, []);
};

watch(
  () => state.formData.effectType,
  (val) => {
    console.log(val);
    if (val == "0") {
      treeRef.value.setCheckedKeys([]);
    }
  },
);

watch(
  () => state.formData.effectList,
  (val) => {
    let kes = flatEeffectTypeList(val);
    console.log("kes>>>", kes);
    treeRef.value.setCheckedKeys(kes);

  },
);

defineExpose({
  open,
});
</script>

<template>
  <el-dialog
    class="alarm-dailog"
    v-model="state.visible"
    title="新增告警配置"
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
        label="检测类型："
        prop="detectType"
        style="width: 100%"
        :rules="[
          { required: true, message: '检测类型不能为空', trigger: 'change' },
        ]"
      >
        <el-select
          v-model="state.formData.detectType"
          placeholder="请选择型号"
          style="width: 100%"
        >
          <el-option
            v-for="(item, i) in state.detectTypeOptions"
            :key="i"
            :label="item['name']"
            :value="item['code']"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="预警阈值：" style="width: 100%">
        <el-col :span="11">
          <el-form-item prop="warnLowerThreshold">
            <el-input-number
              v-model="state.formData.warnLowerThreshold"
              placeholder="阈值下限"
              style="width: 100%"
              :controls="false"
            />
          </el-form-item>
        </el-col>
        <el-col class="text-center" :span="2">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="warnUpperThreshold">
            <el-input-number
              v-model="state.formData.warnUpperThreshold"
              placeholder="阈值上限"
              style="width: 100%"
              :controls="false"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="一般告警阈值：" style="width: 100%">
        <el-col :span="11">
          <el-form-item prop="generalLowerThreshold">
            <el-input-number
              v-model="state.formData.generalLowerThreshold"
              placeholder="阈值下限"
              style="width: 100%"
              :controls="false"
            />
          </el-form-item>
        </el-col>
        <el-col class="text-center" :span="2">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="generalUpperThreshold">
            <el-input-number
              v-model="state.formData.generalUpperThreshold"
              placeholder="阈值上限"
              style="width: 100%"
              :controls="false"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="严重告警阈值：" style="width: 100%">
        <el-col :span="11">
          <el-form-item prop="warnLowerThreshold">
            <el-input-number
              v-model="state.formData.criticalLowerThreshold"
              placeholder="阈值下限"
              style="width: 100%"
              :controls="false"
            />
          </el-form-item>
        </el-col>
        <el-col class="text-center" :span="2">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="warnUpperThreshold">
            <el-input-number
              v-model="state.formData.criticalUpperThreshold"
              placeholder="阈值上限"
              style="width: 100%"
              :controls="false"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="生效设备：" style="width: 100%">
        <div style="width: 100%">
          <el-row>
            <el-radio-group v-model="state.formData.effectType">
              <el-radio
                v-for="{ code, name } in state.effectTypeRadio"
                :key="code"
                :label="code"
                >{{ name }}</el-radio
              >
            </el-radio-group>
          </el-row>
          <el-row>
            <el-tree
              ref="treeRef"
              v-show="state.formData.effectType == '1'"
              style="width: 100%"
              :data="state.effectTypeTree"
              show-checkbox
              node-key="id"
              :props="{
                children: 'children',
                label: 'label',
              }"
            />
          </el-row>
        </div>
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
