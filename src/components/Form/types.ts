import type { InjectionKey } from 'vue'
import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator'

export interface FormItemProps {
  label?: string
  prop?: string // 表单字段名
}
export interface FormItemRule extends RuleItem {
  trigger?: string
}
export type FormRules = Record<string, FormItemRule[]>

export interface FormProps {
  // 表单数据
  model: Record<string, any>
  rules?: FormRules
}

export interface FormContext extends FormProps {
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
}

export interface ValidateStatusProp {
  state: 'init' | 'success' | 'error'
  errorMsg: string
  loading: boolean
}

export interface FormItemContext {
  prop: string
  validate: (trigger?: string) => Promise<Boolean>
  resetField(): void
  clearValidate(): void
}
// 验证失败的类型
export interface FormValidateFailure {
  errors: ValidateError[] | null
  fields: ValidateFieldsError
}

export interface FormInstance {
  validate: () => Promise<Boolean>
  resetFields: (props?: string[]) => void
  clearValidate: (props?: string[]) => void
}

export interface FormItemInstance {
  validateStatus: ValidateStatusProp
  validate: (trigger?: string) => Promise<Boolean>
  resetField(): void
  clearValidate(): void
}

export const formContextKey: InjectionKey<FormContext> = Symbol('formContextKey')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('formItemContextKey')
