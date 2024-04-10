
interface IOptionsKey {
  label: string,
  value: string,
  children?: string,
}
export interface IFormItem extends IInput,ISelect,IDatePicker,ICheckbox,ICascader {
  label?: string,
  labelWidth?: string | number, // 标签宽度，例如 '50px'。 可以使用 auto。
  el?: string,
  prop: string,
  span?: number,
  type?: string,
  tips?: string,
  value?: any,
  placeholder?: string,
  disabled?: boolean,
  readonly?: boolean,
  options?: Record<string, any>,
  optionsKey?:IOptionsKey,// 键值对
  rules?: import('element-plus').FormItemRule[]
  clearable?: boolean // 是否可清空
  listeners?:any
  formatter?:(value: string | number) => string//指定输入值的格式
}

interface IInput {
  maxlength?: string | number, // 最大输入长度
  minlength?: number // 最小输入长度
  showPassword?: boolean // 是否显示切换密码图标
}

interface ISelect {
  multiple?:boolean
  filterable?: boolean, // 是否开启过滤搜索
  remote?: boolean, // 是否开启远程搜索
  params?: object // 请求后台接口参数
  remoteKey?: string // 远程搜索参数
  getList?:Function
}

interface IDatePicker {
  defaultTime?:string
  format?:string
}

interface ICheckbox {
  hasCheckAll?:boolean
  checkIsWrap?:boolean//全选是否换行
  dataList?:[
    {[key: string]: string;}
  ]
}

interface ICascader {
  cascaderProps?:object
}