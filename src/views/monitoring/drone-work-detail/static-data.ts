/*
 * @Author: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @Date: 2023-11-07 14:36:15
 * @LastEditors: wangwanzhen wangwanzhen@shenhaoinfo.com
 * @LastEditTime: 2023-12-06 15:37:55
 * @FilePath: \dronefinch_web\src\views\monitoring\drone-work-detail\static-data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 图片批量引入
import imagesMap from "@/assets/images_js";

// 气象信息
export const weatherStaticData = [
  {name:"风速", icon:imagesMap["wind-speed"], prop:"wind_speed", unit:"m/s"},
  {name:"温度", icon:imagesMap["temperature"], prop:"environment_temperature", unit:"℃"},
  {name:"湿度", icon:imagesMap["humidity"], prop:"environment_humidity", unit:"℃"},
  {name:"降雨量", icon:imagesMap["rainfall"], prop:"rainfall"},
];

// 机场状态
export const airportStaticData = [
  {name:"累计运行时长", prop:"acc_time", unit:"天"},
  {name:"作业架次", prop:"job_number", unit:"次"},
  {name:"机场搜星", prop:"rtk_number"},
  {name:"舱门", prop:"cover_state"},
  {name:"固定器", prop:"putter_state"},
  {name:"网络", prop:"network_quality"},

  {name:"电流", prop:"working_current", unit:"A"},
  {name:"电压", prop:"working_voltage", unit:"V"},
  {name:"充电器", prop:"drone_charge_state"},
  {name:"舱内温度", prop:"airport_temperature", unit:"℃"},
  {name:"电池温度", prop:"battery_temperature", unit:"℃"},
  {name:"空调状态", prop:"air_conditioner_state"},
];


// 飞行器状态
export const droneStaticData = [
  {name:"累计运行时长", prop:"drone_total_flight_time", unit:"小时"},
  {name:"作业架次", prop:"drone_total_flight_sorties", unit:"次"},
  {name:"飞行器搜星", prop:"drone_rtk_number"},
  {name:"档位", prop:"drone_gear"},
  {name:"速度", prop:"drone_speed", unit:"m/s"},
  {name:"电量", prop:"drone_battery", unit:"%"},
  {name:"图传信号", prop:"pic_transmission_signal"},
  {name:"绝对高度", prop:"drone_height", unit:"m"},
  {name:"相对高度", prop:"drone_elevation", unit:"m"},
];

// 云台控制类型
export const PTZControlList = [
  {name:"拍照模式", value:0},
  {name:"摄像模式", value:1},
];

// 云台重置类型
export const PTZResetList = [
  {name:"云台回中", value:"0"},
  {name:"云台向下", value:"1"},
  {name:"偏航回中", value:"2"},
  {name:"俯仰向下", value:"3"},
];