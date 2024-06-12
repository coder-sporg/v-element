<template>
  <div class="vk-form">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import {
  formContextKey,
  type FormInstance,
  type FormContext,
  type FormItemContext,
  type FormProps,
  type FormValidateFailure
} from './types'
import type { ValidateFieldsError } from 'async-validator'

defineOptions({
  name: 'VKForm'
})
const props = defineProps<FormProps>()

const fields: FormItemContext[] = []

const addField: FormContext['addField'] = (field) => {
  fields.push(field)
}

const removeField: FormContext['removeField'] = (field) => {
  const index = fields.indexOf(field)
  if (index > -1) {
    fields.splice(index, 1)
  }
}

// 可以选择恢复哪一项的值
const resetFields = (keys: string[] = []) => {
  const filterArr = keys.length > 0 ? fields.filter((item) => keys.includes(item.prop)) : fields
  filterArr.forEach((field) => field.resetField())
}

// 可以选择清除哪一项的校验
const clearValidate = (keys: string[] = []) => {
  const filterArr = keys.length > 0 ? fields.filter((item) => keys.includes(item.prop)) : fields
  filterArr.forEach((field) => field.clearValidate())
}

const validate = async () => {
  // 存储 key value
  let validationErrors: ValidateFieldsError = {}
  for (const field of fields) {
    try {
      await field.validate()
    } catch (e) {
      // catch 中的错误 ts 无法识别
      const error = e as FormValidateFailure
      validationErrors = {
        ...validationErrors,
        ...error.fields
      }
    }
  }

  if (Object.keys(validationErrors).length === 0) return true
  return Promise.reject(validationErrors)
}

provide(formContextKey, {
  ...props,
  addField,
  removeField
})

// 暴露方法
defineExpose<FormInstance>({
  validate,
  resetFields,
  clearValidate
})
</script>
