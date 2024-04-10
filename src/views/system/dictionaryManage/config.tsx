import { ColumnProps } from "@/components/ProTable/interface";

export const itemColumns: ColumnProps[] = [
    { type: "index", label: "序号", width: 80 },
    {
        label: '名称',
        prop: 'name',
        search: { el: "input" }
    },
    {
        label: '标识',
        prop: 'identify',
        search: { el: "input"}

    },
    {
        label: '状态',
        prop: "state",
        search: { el: "select"},
        render: scope => {
            return(
                <span 
                class={(scope.row.state == '启用') ? 'text-green-400' : 'text-red-400'}> {scope.row.state}</span>
            )
        }

    },
    {
        label: '操作',
        prop: 'operation',
    }   
]
export const leftColumns: ColumnProps[]= [
   
    {
        label: '名称',
        prop: 'name',
        search: { el: "input"}
    },   
    {
        label: '状态',
        prop: "state",
        render: scope => {
            return(
                <span 
                class={(scope.row.state == '启用') ? 'text-green-400' : 'text-red-400'}> {scope.row.state}</span>
            )
        }
       
    }
]