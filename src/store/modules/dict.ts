/*
 * @Author: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @Date: 2023-11-21 15:06:14
 * @LastEditors: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @LastEditTime: 2023-11-30 14:27:20
 * @FilePath: \dronefinch_web\src\store\modules\dict.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia";
import { getDictTree } from "@/api/interface/dict/dict";
import { getLineSelectList } from "@/api/interface/maintenance/line";
import { ElMessage as createMessage } from "element-plus";

export const dictStore = defineStore({
  id: "dict", // 必须指明唯一的pinia仓库的id
  state: () => (
    {
      statusMapList:{}, //字典缓存
    }
  ),
  actions: {
    // 获取指定类型的字典 
    async getDictTree (dictTypeCode){
      // 防止重复请求已经存在state
      if (this.statusMapList[dictTypeCode]?.length){
        return {data:{list:this.statusMapList[dictTypeCode]}};
      }
      const params = {
        dictTypeCode,
      };
      const res = await getDictTree(params);
      this.statusMapList[dictTypeCode] = res.data?.list || [];
      return res;
    },
    // 获取线路下拉选项
    async getPartsTypeList (params?:{lineName?:string}){
      const res = await getLineSelectList(params);
      const arr = res.data
      res.data = {list:arr};
      return res;
    },
  },
  getters: {
  },
  persist: {
    key: "storge_dict",
    paths: [],
  },
});
