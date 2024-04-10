<!--
 * @Date: 2023-07-03 16:16:29
 * @LastEditors: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @LastEditTime: 2023-12-01 12:41:57
 * @FilePath: \robot_outdoor_e_vue3\src\views\login\index.vue
-->

<template>
  <div class="login-container">
    <VScaleScreen :boxStyle="{ 'background-color': 'transparent' }" width="1920" height="1080" :delay="100">
      <div class="container-inner">
        <div class="login__form">
          <div class="body">
            <span class="cn text-center mb-8">无人机自主巡检平台</span>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0" class="demo-ruleForm text-sm" status-icon
              size="large">
              <el-form-item label="" prop="username" class="mb-8">
                <el-input v-model="ruleForm.username" placeholder="请输入用户名称" >
                  <template #prefix>
                    <i class="iconfont icon-yonghu"></i>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="password" class="mb-8">
                <el-input type="password" v-model="ruleForm.password" show-password placeholder="请输入登录密码">
                  <template #prefix>
                    <i class="iconfont icon-mima"></i>
                  </template>
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="" prop="code" class="mb-8 flex items-center justify-between">
                <el-input class="flex-1" v-model="ruleForm.code" show-password placeholder="请输入验证码">
                  <template #prefix>
                    <i class="iconfont icon-shouji"></i>
                  </template>
                </el-input>
                <img class="flex-shrink-0 code-image ml-3 cursor-pointer" :src="codeImage" @click="getAuthImage" />
              </el-form-item> -->
            </el-form>
            <div class="submitBtn flex justify-center items-center cursor-pointer" v-loading="processing" @click="submitForm(ruleFormRef)">
              登录
            </div>
            <div class="text-center text-opacity-80 text-white text-sm mt-6">
              <div class="">@2023 杭州申昊科技股份有限公司 SHENHAO </div>
              <div>浙ICP备09015103号-3</div>
            </div>
          </div>
        </div>
      </div>
    </VScaleScreen>
  </div>
</template>

<script setup lang="ts">
import { userStore } from "@/store/index";
import VScaleScreen from "v-scale-screen";
import { reactive, ref, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage as createMessage } from "element-plus";
import { router } from "@/router";

const useUserStore = userStore();
const processing = ref(false);
let codeImage = ref(""); // 验证码图片

const ruleFormRef = ref<FormInstance>();


interface RuleForm {
  username: string
  password: string,
  code:string
}

const ruleForm = reactive<RuleForm>({
  username: "",
  password: "",
  code: "",
});


const check = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@;:])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@;:])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@;:]))/;
const validatePassword = (_rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入登录密码"));
  } else if (value.length < 8) {
    callback(new Error("用户密码不得小于8位"));
  } else if (!check.test(value)) {
    callback(new Error("密码应为大写字母、小写字母、数字、特殊字符中三种或三种以上的组合"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules<RuleForm>>({
  username: [{  required: true, trigger: "change", message:"请输入用户名称" }],
  password: [{ validator: validatePassword, trigger: "change" }],
  // code: [{ required: true, trigger: "change", message:"请输入验证码" }],
});

onMounted(() => {
  // getAuthImage();
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl || processing.value) return;
  try {
    await formEl.validate();
    const { username, password } = ruleForm;
    processing.value = true;
    await useUserStore.login(username, password);
    const routes = await useUserStore.getUserAuthRoute();
    let path = "/";
    if (routes.length) {
      const first = routes[0] as any;
      if (first.children && first.children.length) {
        path = `/home/${first.path}/${first.children[0].path}`;
      } else {
        path = `/home/${first.path}`;
      }
    }
    router.push(path);
    createMessage.success("登录成功");
  } catch (error) {
    console.log("error submit!", error);
  } finally {
    processing.value = false;
  }

};

// 获取图片验证码
const getAuthImage = async () => {
  const data = await useUserStore.getAuthImage();
  codeImage.value = window.URL.createObjectURL(new Blob([data], {type:"image/png"}));
};

</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background-image: url(@/assets/images/login_bg1.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;

  .container-inner {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    position: relative;
    margin-right:240px ;

    .login-logo {
      width: 350px;
      height: 117px;
      position: absolute;
      left: 48px;
      top: 48px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      .logo-1 {
        height: 61px;
        width: 200px;
        // background-image: url(@/assets/images/login_logo.png);
        background-size: cover;
        background-repeat: no-repeat;
      }

      .logo-2 {
        width: 100%;
        height: 53px;

        .cn {
          width: 100%;
          height: 36px;
          font-size: 24px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
          line-height: 28px;
          letter-spacing: 8.5px;
          text-align: end;
        }

        .en {
          height: 20px;
          font-size: 10px;
          font-family: Adobe Song Std-L, Adobe Song Std;
          font-weight: normal;
          color: #ffffff;
          line-height: 12px;
          text-align: end;
        }
      }
    }

    .login__form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .title {
        height: 118px;
        font-size: 80px;
        font-family: Source Han Sans CN-Bold, Source Han Sans CN;
        font-weight: bold;
        line-height: 118px;
        letter-spacing: 6px;
        text-shadow: 4px 4px 8px rgba(45, 115, 227, 0.25);
        background: linear-gradient(180deg, #ffffff 12%, #00b6ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
      }

      .body {
        display: flex;
        flex-direction: column;
        // height:440px;
        width: 440px;
        padding: 40px;
        background-color: rgba(25, 53, 128, 1);
        border: 1px solid rgba(24, 94, 214, 1);

        .cn {
          font-size: 32px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
          line-height: 38px;
        }

        .en {}

        .login-icon {
          height: 16px;
          width: 14px;
          background-image: url(@/assets/images/login_user.png);
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }

        .password {
          height: 18px;
          background-image: url(@/assets/images/login_password.png);
        }

        .submitBtn {
          height: 40px;
          background: rgba(54, 158, 248, 1);
          border-radius: 3px;
          text-align: center;
          font-size: 14px;
          color: #fff;
        }

        .code-image{
          width: 100px;
          height: 40px;
          border-radius: 3px 3px 3px 3px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.login-container {
  .el-input__inner {
    height: 40px;
  }

  .el-input__suffix {
    font-size: 22px;
  }

  .el-input-group__prepend {
    background-color: rgba(41, 71, 150, 1);
    // border: 1px solid;
    box-shadow: none;
    padding: 0 14px;
  }
  .el-input__wrapper{
    background-color: rgba(41, 71, 150, 1);
    border: 0;
    box-shadow: none;

  }
}
</style>
