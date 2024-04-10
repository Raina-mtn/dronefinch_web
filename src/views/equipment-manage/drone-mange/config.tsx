/*
 * @Date: 2023-11-03 10:40:25
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-11-07 13:09:32
 * @FilePath: \dronefinch_web\src\views\equipment-manage\drone-mange\config.tsx
 */
import { ColumnProps } from "@/components/ProTable/interface";
export function getColumns(state: object): ColumnProps[] {
    const columns: ColumnProps[] = [
        { type: "index", label: "序号", width: 80 },
        {
            label: "飞行器名称",
            prop: "dataName",
            search: { el: "input", key: 'dataName' },
        },
        {
            label: "设备型号",
            prop: "deviceModelName",
            search: {
                el: "select", key: 'deviceModel', render: (e) => {
                    return (
                        <el-select model-value={e.searchParam['deviceModel']} onChange={(val) => e.searchParam['deviceModel'] = val} placeholder="请选择">
                            {state['droneModelList'].map(({ name, code }) => <el-option key={code} label={name} value={code} />)}
                        </el-select>
                    );
                }
            },
        },
        {
            label: "设备SN",
            prop: "deviceSn",
        },
        {
            label: "固件版本",
            prop: "firmwareVersion",
        },
        {
            label: "归属机场",
            prop: "belongAirportName",
            search: {
                el: "select", key: 'belongAirport', render: (e) => {
                    return (
                        <el-select model-value={e.searchParam['belongAirport']} onChange={(val) => e.searchParam['belongAirport'] = val} placeholder="请选择">
                            {state['belongAirportList'].map(({ dataName, id }) => <el-option key={id} label={dataName} value={id} />)}
                        </el-select>
                    );
                }
            },
        },
        {
            label: "创建时间",
            prop: "createTime",
        },
        {
            label: "最近在线时间",
            prop: "lastOnlineTime",
        },
        {
            label: "设备状态",
            prop: "deviceStatus",
        },
        {
            label: "操作",
            prop: "operation",
        },
    ];
    return columns;
};
