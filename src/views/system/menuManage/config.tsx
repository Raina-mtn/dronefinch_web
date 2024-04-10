import { ColumnProps } from "@/components/ProTable/interface";
export const columns: ColumnProps[]  = [
  
    {
        label: '菜单名称',
        prop: 'menuName',
    },
    {
        label: '菜单类型',
        prop: 'menuType'
    },
    {
        label: 'icon',
        prop: "menuIcon",
    },
    {
        label: '组件',
        prop: 'menuComponent',
    },
    {
        label: '路径',
        prop: 'path',
   
    },
    {
        label: '排序',
        prop: 'rank',
    },

    {
        label: '操作',
        prop: 'operation',
        fixed: "right",
        width: 330
    }
]
