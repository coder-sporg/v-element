import type { VNode } from 'vue'

export interface SelectOption {
  label: string | number
  value: ValueType
  disabled?: boolean
}

export type ValueType = string | number

export type RenderLabelFun = (option: SelectOption) => VNode
export type CustomFilterMethodFunc = (value: ValueType) => SelectOption[]
export type CustomFilterRemoteFunc = (value: string) => Promise<SelectOption[]>

export interface SelectProps {
  // v-model
  modelValue: ValueType
  // 选项 远程搜索时可以不传
  options?: SelectOption[]
  // 一些基本表单属性
  placeholder?: string
  disabled?: boolean
  // 其他属性
  clearable?: boolean
  renderLabel?: RenderLabelFun
  filterable?: boolean
  filterMethod?: CustomFilterMethodFunc
  remote?: boolean
  remoteMethod?: CustomFilterRemoteFunc
}
export interface SelectStates {
  inputValue: ValueType
  selectedOption: null | SelectOption
  mouseHover: boolean // 是否鼠标悬停
  loading: boolean
  highlightIndex: number // 高亮显示
}

export interface SelectEmits {
  (e: 'change', value: ValueType): void
  (e: 'update:modelValue', value: ValueType): void
  (e: 'visible-change', value: boolean): void
  (e: 'clear'): void
}
