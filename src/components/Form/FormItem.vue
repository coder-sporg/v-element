<template>
  <div
    class="vk-form-item"
    :class="{
      'is-error': validateStatus.state === 'error',
      'is-success': validateStatus.state === 'success',
      'is-loading': validateStatus.loading,
      'is-required': isRequired
    }"
  >
    <label class="vk-form-item__label">
      <!-- 作用域插槽 -->
      <slot name="label" :label="label">
        {{ label }}
      </slot>
    </label>
    <div class="vk-form-item__content">
      <slot :validate="validate" />
      <div v-if="validateStatus.state === 'error'" class="vk-form-item__error-msg">
        {{ validateStatus.errorMsg }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, reactive } from 'vue'
import { isNil } from 'lodash-es'
import Schema from 'async-validator'
import {
  formContextKey,
  formItemContextKey,
  type FormItemProps,
  type FormValidateFailure,
  type ValidateStatusProp,
  type FormItemContext,
  type FormItemInstance
} from './types'

defineOptions({
  name: 'VKFormItem'
})
const props = defineProps<FormItemProps>()

const formContext = inject(formContextKey)

// 验证状态
const validateStatus = reactive<ValidateStatusProp>({
  state: 'init',
  errorMsg: '',
  loading: false
})

let initialValue: any = null
// 拿到表单对应的值
const innerValue = computed(() => {
  const model = formContext?.model
  // isNil 判断是否为空 0 '' 除外
  if (model && props.prop && !isNil(model[props.prop])) {
    return model[props.prop]
  } else {
    return null
  }
})

// 拿到表单对应的验证规则
const itemRules = computed(() => {
  const rules = formContext?.rules
  if (rules && props.prop && !isNil(rules[props.prop])) {
    return rules[props.prop]
  } else {
    return []
  }
})

// 清空校验
const clearValidate = () => {
  validateStatus.state = 'init'
  validateStatus.errorMsg = ''
  validateStatus.loading = false
}

const resetField = () => {
  // 重置验证状态
  clearValidate()
  // 重置表单的值
  const model = formContext?.model
  if (model && props.prop && !isNil(model[props.prop])) {
    model[props.prop] = initialValue // 初始值
  }
}

// 根据传入的 trigger 获取对应的校验规则
const getTriggeredRules = (trigger?: string) => {
  const rules = itemRules.value
  if (rules) {
    return rules.filter((rule) => {
      // 如果规则没有触发方式 则默认校验
      if (!trigger || !rule.trigger) return true
      // 如果有触发方式 则判断是否与传入的触发方式相等
      return rule.trigger && rule.trigger === trigger
    })
  } else {
    return []
  }
}
const isRequired = computed(() => {
  return itemRules.value.some((rule) => rule.required)
})

// 检验
const validate = async (trigger?: string) => {
  const modelName = props.prop
  const triggeredRules = getTriggeredRules(trigger)
  // 没有校验规则直接返回
  if (triggeredRules.length === 0) return true
  if (modelName) {
    const validator = new Schema({
      [modelName]: triggeredRules // 根据传入的 trigger 获取对应的校验规则
    })

    validateStatus.loading = true

    return validator
      .validate({
        [modelName]: innerValue.value
      })
      .then(() => {
        validateStatus.state = 'success'
        return true
      })
      .catch((e: FormValidateFailure) => {
        const { errors } = e
        validateStatus.state = 'error'
        validateStatus.errorMsg = errors?.[0]?.message || ''
        return Promise.reject(e)
      })
      .finally(() => {
        validateStatus.loading = false
      })
  } else {
    return Promise.resolve(true)
  }
}

// 提供给子组件使用
const context: FormItemContext = {
  validate,
  prop: props.prop || '',
  clearValidate,
  resetField
}
provide(formItemContextKey, context)

onMounted(() => {
  if (props.prop) {
    formContext?.addField(context)
    initialValue = innerValue.value
  }
})

onBeforeUnmount(() => {
  if (props.prop) {
    formContext?.removeField(context)
  }
})

defineExpose<FormItemInstance>({
  validateStatus,
  validate,
  resetField,
  clearValidate
})
</script>
