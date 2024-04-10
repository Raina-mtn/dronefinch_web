<template>
  <div class="py-20px px-24px">
    <el-form :model="form" label-width="100px" :inline="true" label-position="left">
      <el-form-item label="识别状态：">
        <el-radio-group v-model="form.detectStatus">
          <el-radio v-for="item in search.detectStatusList" :key="item.code" :label="item.code">{{item.num?`${item.name}（${item.num}）`:item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="识别结果：">
        <el-radio-group v-model="form.detectResult">
          <el-radio v-for="item in search.detectResultList" :key="item.code" :label="item.code">{{item.num?`${item.name}（${item.num}）`:item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="复核状态：">
        <el-radio-group v-model="form.reviewStatus">
          <el-radio v-for="item in search.reviewStatusList" :key="item.code" :label="item.code">{{item.num?`${item.name}（${item.num}）`:item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-button v-if="type==='audit'" color="#369EF8" class="text-white mb-18px" @click="goArtificial">人工复核</el-button>
    <el-button v-if="type==='audit'" color="#369EF8" class="text-white mb-18px" @click="finishAudit">完成复核</el-button>
    <el-button v-if="type==='result'" color="#369EF8" class="text-white mb-18px" @click="goArtificial">复核详情</el-button>

    <el-scrollbar height="600px">
      <div class="flex flex-wrap justify-start">
        <imageItem v-for="item in imageList" :key="item.id" :img="item"></imageItem>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import {getTab, getImageList, finish} from "@/api/interface/patrol/audit";
import {RecordInfo, Search, Image} from "../interface";
import imageItem from "./image-item.vue";
import { ElMessageBox, ElMessage } from "element-plus";

interface Form {
  id:number
  detectType:string
  detectStatus:string
  detectResult:string
  reviewStatus:string
}
interface Props{
  code:string
  recordInfo:RecordInfo
  type:string
}
const props = defineProps<Props>();
const form = ref<Form>({} as Form);
const search = ref<Search>({} as Search);
const router = useRouter(); 
const imageList = ref<Image[]>([] as Image[]);
// const checkList = ref<number[]>([] as number[]);

// 人工审核
const goArtificial = () => {
  router.push({ path: "/home/patrol-manage/artificial-audit", query:{id:props.recordInfo.id, detectType:props.code, type:props.type}});
};
// 获取图片
const getImgList = async () => {
  const params = {
    id:props.recordInfo.id,
    detectType:props.code,
  };
  // 获取radio条件
  search.value = (await getTab(params)).data;
};
// 完成复核
const finishAudit = async () => {
  ElMessageBox.confirm(
    "完成复核后无法再调整缺陷信息,请确认!",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        await finish(props.recordInfo.id);
      } catch (error) {
        console.log("error :>> ", error);
        // ElMessage.warning("请完成全部缺陷复核后再点击完成复核");
      }
    });
};

watch(() => form.value, (newVal) => {
  getImageList(newVal).then(res => {
    imageList.value = res.data;
  });
}, {deep:true});

// // 选中图片
// const checkImg = (item) => {
//   const index = checkList.value.findIndex(i => i.id === item.id);
//   if (index === -1){
//     checkList.value.push(item);
//   } else {
//     checkList.value.splice(index, 1);
//   }
// };
// // 是否选中
// const isCheck = (id) => {
//   return checkList.value.findIndex(i => i.id === id) !== -1;
// };


onMounted(() => {
  getImgList();
  form.value.detectType = props.code;
  form.value.id = props.recordInfo.id;
});
</script>

<style scoped>

</style>