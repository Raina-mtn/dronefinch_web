export const columns = [
   
    {
        label: '操作日志',
        prop: 'logContent',
        isShow:false,
        search: { el: "input"}
    },
    {
        label: '序号',
        prop: 'index',
    },
    {
        label: '日志内容',
        prop: 'logContent',
    },
    {
        label: '操作人ID',
        prop: 'operatorId'
    },
    {
        label: '操作人名称',
        prop: "operatorName",
    },
    {
        label: 'IP',
        prop: 'ip',
    },
    {
        label: '耗时（毫秒）',
        prop: 'spendTime',

    },
    {
        label: '日志类型',
        prop: 'logType',
    },
    {
        prop: "accessTime",
        label: "创建时间",
        // type: 'datetimerange',
        // 'value-format': 'YYYY-MM-DD HH:mm:ss',
        //   order: 1
        
      },
]
