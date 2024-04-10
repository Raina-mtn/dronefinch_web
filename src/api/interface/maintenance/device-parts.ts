/*
 * @Author: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @Date: 2023-11-01 15:23:36
 * @LastEditors: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @LastEditTime: 2023-11-17 12:38:44
 * @FilePath: \dronefinch_web\src\api\interface\maintenance\device-parts.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defHttp } from "@/api/http";


// 获取线路管理list
export const getDevicePartsList = (params) => {
  return defHttp.get({
    url: "/sps/v1/device-parts",
    params,
  });
};

// 设备台账 - 模板下载
export const downloadDeviceFile = () => {
  return defHttp.get({
    url: "/sps/v1/device-parts/download",
    responseType: "arraybuffer",
  },
  {
    isReturnNativeResponse:true,
  },
  );
};

// 设备台账 - 导入设备
export const uoloadDeviceFile = (params) => {
  return defHttp.post({
    url: "/sps/v1/device-parts/upload",
    headers:{
      "Content-Type":"multipart/form-data",
    },
    params,
  });
};
  
// 设备台账 - 添加设备
export const addDevice = (params) => {
  return defHttp.post({
    url: "/sps/v1/device-parts",
    params,
  });
};

// 设备台账 - 编辑设备
export const editDevice = (id, params) => {
  return defHttp.post({
    url: `/sps/v1/device-parts/update/${id}`,
    params,
  });
};

// 设备台账 删除记录
export const deleteDevice = (id) => {
  return defHttp.get({
    url: `/sps/v1/device-parts/delete/${id}`,
  });
};
  
// 设备台账 - 获取设备详情
export const getdDeviceDetail = (id) => {
  return defHttp.get({
    url: `/sps/v1/device-parts/${id}`,
  });
};
  
// 设备台账 - 下拉选项线路名称
export const getLineList = () => {
  return defHttp.get({
    url: "/sps/v1/device-parts/select",
  });
};