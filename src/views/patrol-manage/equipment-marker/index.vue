<template>
  <div class="flex h-full">
    <div class="w-380px bg-[#0B2363] p-16px text-white mr-16px">
      <div class="flex mb-16px">
        <span class="w-[25%]">航点编号：</span>
        <el-input v-model="form.placeCode" placeholder="请输入" clearable class="w-[75%]" @input="refresh"></el-input>
      </div>
      <div class="flex mb-16px">
        <span class="w-[25%]">绑定状态：</span>
        <el-select v-model="form.bindStatus" placeholder="请选择" clearable class="w-[75%]" @change="refresh">
          <el-option
            v-for="item in bindOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-scrollbar height="750px">
        <div v-infinite-scroll="waylineLoad" :infinite-scroll-disabled="airlineDisabled">
          <airlineItem v-for="item in airlineList" :key="item.id" :item="item" :check-id="currenCheck.id" @click="setCurrentCheck(item)"></airlineItem>
        </div>
    </el-scrollbar>
    </div>

    <!-- 拍摄图库 -->
    <div class="flex-grow bg-[#0B2363] p-16px text-white w-[calc(100%_-_380px)]">
      <div class="flex-between">
        <div class="before:content-DEFAULT before:rounded-4px before:inline-block before:w-4px before:h-20px before:bg-[#0AF0FD] before:mr-10px text-white text-16px flex items-center pb-16px">
          拍摄图库
        </div>
        <div>
          {{ desc }}
          <el-button class="ml-12px text-white" color="#369EF8" @click="bindDialogRef.openDialog(currenCheck)">绑定设备点</el-button>
        </div>
      </div>
      <el-scrollbar height="800px">
        <div class="flex flex-wrap justify-start">
          <el-image v-for="item in imageList" :key="item.id" :id="item.id" class="w-276px h-170px m-8px" :src="item.url" fit="fill" />
        </div>
        <el-pagination
          class="absolute bottom-50px right-10px"
          :background="true"
          :current-page="imageParams['page.pageIndex']"
          :page-size="imageParams['page.pageSize']"
          :page-sizes="[10, 25, 50, 100]"
          :total="imageParams.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-scrollbar>
    </div>

    <bindDialog ref="bindDialogRef" @getWayline="bindRefresh"></bindDialog>
  </div>
</template>

<script setup lang="ts">
import airlineItem from "./components/airline-item.vue";
import bindDialog from "./components/bind-dialog.vue";
import { ref, reactive, onMounted, computed } from "vue";
import {bindOptions} from "@/utils/config";
import {getWaylineList, getWaylineImage} from "@/api/interface/patrol/airline";
import {useRoute} from "vue-router";

interface Airline{
  id: number;
  placeCode: string;
  actionCode: string;
  bindStatus: string;
  bindStatusName: string;
  partsId: number;
  partsName: string;
  partsType: string;
  partsTypeName: string;
  towerName: string;
  lineId: number;
  lineName: string;
}
interface ImageList{
  imageId: number;
  imageUrl: string;
}
interface Form{
  placeCode:string
  bindStatus:string
}

const route = useRoute();

const bindDialogRef = ref();
const form = ref<Form>({} as Form);//表单数据
const totalPage = ref(0);//总页数
const currenCheck = ref<Airline>({} as Airline);//当前选中航点动作
const airlineList = ref<Airline[]>([] as Airline[]);//航点动作
const imageList = ref<ImageList[]>();//图库
//懒加载参数
const params = reactive({
  "page.pageIndex":1,
  "page.pageSize":10,
});
// 图库参数
const imageParams = reactive({
  "page.pageIndex":1,
  "page.pageSize":10,
  total:0,
});
const airlineLoading = ref(false);//懒加载load

// 航点动作详情
const desc = computed(() => {
  return `${ currenCheck.value.partsName ?? "" }-${ currenCheck.value.lineName ?? "" }-${ currenCheck.value.towerName ?? "" }`;
});
const airlineDisabled = computed(() => airlineLoading.value || totalPage.value === params["page.pageIndex"]);

//查询图库
const getImage = async () => {
  const res = (await getWaylineImage({actionId:currenCheck.value.id, ...imageParams})).data;
  imageList.value = res.list;
  imageParams["page.pageIndex"] = res.totalPage;
  imageParams.total = res.totalCount;
};
// 每页条数改变
const handleSizeChange = (val: number) => {
  imageParams["page.pageIndex"] = 1;
  imageParams["page.pageSize"] = val;
  getImage();
};
// 当前页改变
const handleCurrentChange = (val: number) => {
  imageParams["page.pageIndex"] = val;
  getImage();
};
// 当前选中航点动作
const setCurrentCheck = (item) => {
  if (item){
    currenCheck.value = item;
    imageParams["page.pageIndex"] = 1;
    imageParams["page.pageSize"] = 10;
    getImage();
  }
};
// 分页查询航点动作
const waylineLoad = async () => {
  airlineLoading.value = true;
  params["page.pageIndex"] = params["page.pageIndex"] + 1;
  const res = (await getWaylineList(params)).data;
  airlineList.value.concat(res.list);
  totalPage.value = res.totalPage;
  airlineLoading.value = false;
};

// 查询航点动作
const getWayline = async () => {
  airlineLoading.value = true;
  params.wayId = route.query.id;
  const res = (await getWaylineList({...params, ...form.value})).data;
  airlineList.value = res.list;
  totalPage.value = res.totalPage;
  airlineLoading.value = false;
};
// 更新数据
const refresh = async () => {
  params["page.pageIndex"] = 1;
  await getWayline();
  setCurrentCheck(airlineList.value[0]);
};
// 绑定后更新数据
const bindRefresh = async () => {
  await getWayline();
  setCurrentCheck(currenCheck.value.id);
};
// 初始化
onMounted(async () => {
  await getWayline();
  setCurrentCheck(airlineList.value[0]);

});
</script>

<style scoped>

</style>