export default [
  {
    alwaysShow: true,
    label: "实时监测",
    path: "monitoring",
    component: "/views/Parent.vue",
    children: [
      {
        alwaysShow: true,
        label: "实时监测",
        path: "list",
        component: "/views/monitoring/real-time-monitoring/real-time-monitoring.vue",
      },
      {
        alwaysShow: false,
        hidden: true,
        label: "实时监测",
        path: "detail/:id",
        name:"DroneWorkDetail",
        component: "/views/monitoring/drone-work-detail/drone-work-detail.vue",
        meta:{
          needLayout:false, //是否需要头部导航
        },
      },
    ],
  },
  {
    alwaysShow: true,
    icon: "el-icon-my-robot",
    label: "巡检管理",
    path: "patrol-manage",
    component: "/views/Parent.vue",
    children: [
      {
        alwaysShow: true,
        label: "任务记录",
        path: "task-record",
        component: "/views/patrol-manage/task-record/index.vue",
      }, {
        alwaysShow: false,
        hidden: true,
        label: "检测复核",
        path: "audit",
        component: "/views/patrol-manage/audit/index.vue",
        meta:{
          activeMenu:"task-record",
        },
      }, {
        alwaysShow: false,
        hidden: true,
        label: "人工复核",
        path: "artificial-audit",
        component: "/views/patrol-manage/artificial-audit/index.vue",
        meta:{
          activeMenu:"task-record",
        },
      }, {
        alwaysShow: true,
        label: "任务计划",
        path: "task-plan",
        component: "/views/patrol-manage/task-plan/index.vue",
      }, {
        alwaysShow: true,
        label: "航线管理",
        path: "airline-manage",
        component: "/views/patrol-manage/airline-manage/index.vue",
      }, {
        alwaysShow: false,
        hidden: true,
        label: "设备点标注",
        path: "equipment-marker",
        component: "/views/patrol-manage/equipment-marker/index.vue",
        meta:{
          activeMenu:"airline-manage",
        },
      },
    ],
  },
  {
    alwaysShow: true,
    icon: "el-icon-my-robot",
    label: "运维管理",
    path: "maintenance",
    component: "/views/Parent.vue",
    children: [{
      alwaysShow: true,
      label: "线路管理",
      path: "route",
      component: "/views/maintenance/route-manage/route-manage.vue",
    }, {
      alwaysShow: true,
      label: "设备台账",
      path: "device",
      component: "/views/maintenance/device-ledger/device-ledger.vue",
    }],
  },
  {
    alwaysShow: true,
    icon: "el-icon-my-robot",
    label: "数据分析",
    path: "data-analyse",
    component: "/views/Parent.vue",
    children: [{
      alwaysShow: true,
      label: "线路分析",
      path: "line-analyse",
      component: "/views/dataAnalyse/lineAnalyse/index.vue",
    }, {
      alwaysShow: false,
      hidden: true,
      label: "检测图片",
      path: "image-marker",
      component: "/views/dataAnalyse/imageMarker/index.vue",
      meta:{
        activeMenu:"line-analyse",
      },
    }],
  },
  {
    alwaysShow: true,
    icon: "el-icon-my-robot",
    label: "设备管理",
    path: "equipment-manage",
    component: "/views/Parent.vue",
    children: [{
      alwaysShow: true,
      label: "机场管理",
      path: "airport-manage",
      component: "/views/equipment-manage/airport-manage/airport-manage.vue",
    }, {
      alwaysShow: false,
      hidden: true,
      label: "远程调试",
      path: "remote-debugging",
      component: "/views/equipment-manage/remote-debugging/remote-debugging.vue",
      meta:{
        activeMenu:"airport-manage",
      },
    }, {
      alwaysShow: true,
      label: "告警配置 ",
      path: "alarmConfig",
      component: "/views/equipment-manage/alarm-config/alarm-config.vue",
    }, {
      alwaysShow: true,
      label: "飞行器管理 ",
      path: "droneMange",
      component: "/views/equipment-manage/drone-mange/drone-mange.vue",
    }],
  },
  {
    alwaysShow: true,
    icon: "el-icon-my-robot",
    label: "用户管理",
    path: "authManage",
    component: "/views/Parent.vue",
    children: [{
      alwaysShow: true,
      label: "用户管理",
      path: "userManage",
      component: "/views/authManage/userManage/index.vue",
    }, {
      alwaysShow: true,
      label: "角色管理",
      path: "roleManage",
      component: "/views/authManage/roleManage/index.vue",
    }, {
      alwaysShow: true,
      label: "日志查询",
      path: "logManage",
      component: "/views/authManage/logManage/index.vue",
    }],
  },
  {
    alwaysShow: true,
    icon: "el-icon-my-robot",
    label: "系统管理",
    path: "system",
    component: "/views/Parent.vue",
    children: [{
      alwaysShow: true,
      label: "字典管理",
      path: "dictionary-manage",
      component: "/views/system/dictionaryManage/index.vue",
    }, {
      alwaysShow: true,
      label: "菜单管理",
      path: "menu-manage",
      component: "/views/system/menuManage/index.vue",
    }, {
      alwaysShow: true,
      label: "日志管理",
      path: "operationLog-manage",
      component: "/views/system/operationLogManage/index.vue",
    }, {
      alwaysShow: true,
      hidden: true,
      label: "点位设置",
      path: "point",
      component: "/views/system/pages/point/index.vue",
    }, {
      alwaysShow: true,
      hidden: true,
      label: "对时设置",
      path: "time",
      component: "/views/system/pages/time/index.vue",
    }, {
      alwaysShow: true,
      hidden: true,
      label: "告警设置",
      path: "alarm",
      component: "/views/system/pages/alarm/index.vue",
    }, {
      alwaysShow: true,
      hidden: true,
      label: "告警设置详情",
      path: "alarm-detail",
      component: "/views/system/pages/alarm-detail/index.vue",
    }, {
      alwaysShow: true,
      hidden: true,
      label: "联动设置",
      path: "linkage",
      component: "/views/system/pages/linkage/index.vue",
    }],
  },
 
];
