import { ColumnProps } from "@/components/ProTable/interface";
export const columns: ColumnProps[] = [
  {
    type: "index",
    label: "序号",
    width: 80,
  },
  {
    prop: "roleName",
    label: "角色名称",
    search: { el: "input", key: 'roleNameLike' }
  },
  {
    prop: "roleType",
    label: "角色类型"
  },
  {
    prop: "roleDesc",
    label: "备注"
  },
  {
    prop: "status",
    label: "状态",
    render: ({ row }) => {
      return (<span class={row.status == 'NORMAL' ? 'text-green-400' : 'text-red-400'}> {row.status == 'NORMAL' ? '正常' : '异常'}</span>)
    }
  },
  {
    prop: "createTime",
    label: "创建时间",
    search: {
      el: "date-picker",
      props: {
        type: 'daterange'
      }
    }
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 330
  }
]; 