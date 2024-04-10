// 无人机状态
export enum DroneStatusEnum {
    WORK = 1, //作业中
    NOWORK = 0, //无作业
}

// 是否远程控制
export enum IsControlDrone {
    YES = "control", //远程控制
    NO = "",
}

// 是否预览
export enum  WorkPreview{
    YES = "1", //预览
    NO = "",
}

// 任务计划执行类型
export enum PlanComplyType {
    REGULAR = "manual", //手动任务
    CYCLE = "cycle", //周期
}

// 任务计划执行类型
export enum DroneControlPower {
    FLY = 0, //抢夺飞行控制权
    LOAD = 1, //抢夺负载控制权
    RETURN = 2, //智能返航
    STOP = 3, //急停
    ONETOUCH = 4 //一键起飞
}

// 机场状态 - 充电器
export enum AirportCharger {
    CHARGING = 1, //充电中
    IDLE = 0, //空闲
}

// 无人机是否在线
export enum DRONEALIVE {
    YES = 1, //在线
    NO = 0, //未在线
}


// 视频类型
export enum VIDEOTYPE {
    AIRPORT = 1, //机场
    DRONE = 0, //无人机
}