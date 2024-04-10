/*
 * @Date: 2023-11-06 12:53:28
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-11-06 15:23:34
 * @FilePath: \dronefinch_web\src\views\equipment-manage\alramConfig\config.tsx
 */
import { ColumnProps } from "@/components/ProTable/interface";
export function getColumns(state: object): ColumnProps[] {
    const columns: ColumnProps[] = [
        { type: "index", label: "序号", width: 80 },
        {
            label: "检测类型",
            prop: "detectTypeName",
            search: {
                el: "select", key: 'detectType', render: (e) => {
                    return (
                        <el-select model-value={e.searchParam['detectType']} onChange={(val) => e.searchParam['detectType'] = val} placeholder="请选择">
                            {state['detectTypeOptions'].map(({ code, name }) => <el-option key={code} label={name} value={code} />)}
                        </el-select>
                    );
                },
            },
        },
        {
            label: "预警阈值",
            prop: "warnLower",
            render: function ({ row: { warnLowerThreshold, warnUpperThreshold } }) {
                return <span>{warnLowerThreshold ?? 0} - {warnUpperThreshold ?? 0}</span>;
            },
        },
        {
            label: "一般告警",
            prop: "generalLower",
            render: function ({ row: { generalLowerThreshold, generalUpperThreshold } }) {
                return <span>{generalLowerThreshold ?? 0} - {generalUpperThreshold ?? 0}</span>;
            },
        },
        {
            label: "严重告警",
            prop: "critical",
            render: function ({ row: { criticalLowerThreshold, criticalUpperThreshold } }) {
                return <span>{criticalLowerThreshold ?? 0} - {criticalUpperThreshold ?? 0}</span>;
            },
        },
        {
            label: "生效设备",
            prop: "effectTypeName",
            search: {
                el: "select", key: 'effectType', render: (e) => {
                    return (
                        <el-select model-value={e.searchParam['effectType']} onChange={(val) => e.searchParam['effectType'] = val} placeholder="请选择">
                            {state['effectTypeOptions'].map(({ id, partsName }) => <el-option key={id} label={partsName} value={id} />)}
                        </el-select>
                    );
                },
            },
        },
        {
            label: "操作时间",
            prop: "updateTime",
        },
        {
            label: "操作",
            prop: "operation",
        },
    ];
    return columns;
}
