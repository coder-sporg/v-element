<template>
  <div
    class="vk-select"
    :class="{ 'is-disabled': disabled }"
    @click="toggleDropdown"
    @mouseenter="states.mouseHover = true"
    @mouseleave="states.mouseHover = false"
  >
    <Tooltip
      placement="bottom-start"
      ref="tooltipRef"
      :popperOptions="popperOptions"
      @click-outside="controlDropdown(false)"
      manual
    >
      <Input
        v-model="states.inputValue"
        :disabled="disabled"
        :placeholder="filterPlaceholder"
        ref="inputRef"
        :readonly="!filterable || !isDropdownShow"
        @input="debounceOnFilter"
        @keydown="handleKeyDown"
      >
        <template #suffix>
          <Icon
            icon="circle-xmark"
            v-if="showClearIcon"
            class="header-angle"
            @click.stop="clear"
            @mousedown.prevent="NOOP"
          />
          <Icon
            v-else
            icon="angle-down"
            class="header-angle"
            :class="{ 'is-active': isDropdownShow }"
          />
        </template>
      </Input>
      <template #content>
        <div v-if="states.loading" class="vk-select__loading">
          <Icon icon="spinner" spin />
        </div>
        <div v-else-if="filterable && filteredOptions.length === 0" class="vk-select__noData">
          no matching data
        </div>
        <ul v-else class="vk-select__menu">
          <template v-for="(item, index) in filteredOptions" :key="index">
            <li
              class="vk-select__menu-item"
              :class="{
                'is-disabled': item.disabled,
                'is-selected': states.selectedOption?.value === item.value,
                'is-highlighted': states.highlightIndex === index
              }"
              :id="`select-item-${item.value}`"
              @click.stop="itemSelect(item)"
            >
              <RenderVnode :v-node="renderLabel ? renderLabel(item) : item.label" />
              <!-- {{ item.label }} -->
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, inject } from 'vue'
import type { Ref } from 'vue'
import type { ValueType, SelectProps, SelectEmits, SelectOption, SelectStates } from './types'
import Tooltip from '../Tooltip/Tooltip.vue'
import type { TooltipInstance } from '../Tooltip/types'
import Input from '../Input/Input.vue'
import Icon from '../Icon/Icon.vue'
import RenderVnode from '../Common/RenderVnode'
import type { InputInstance } from '../Input/types'
import { debounce, isFunction } from 'lodash-es'
import { formItemContextKey } from '../Form/types'

const findOption = (value: ValueType) => {
  const option = props.options.find((option) => option.value === value)
  return option ? option : null
}

defineOptions({
  name: 'VkSelect'
})
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => []
})
const emits = defineEmits<SelectEmits>()
const initialOption = findOption(props.modelValue)
const tooltipRef = ref() as Ref<TooltipInstance>
const inputRef = ref() as Ref<InputInstance>
const states = reactive<SelectStates>({
  inputValue: initialOption ? initialOption.label : '',
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightIndex: -1
})

// 校验规则
// 注入
const formItemContext = inject(formItemContextKey)
const runValidation = (trigger?: string) => {
  formItemContext?.validate(trigger).catch((e) => {
    console.warn(e.errors)
  })
}

watch(
  () => props.modelValue,
  (newVal) => {
    const option = findOption(newVal)
    if (option) {
      states.inputValue = option.label
      states.selectedOption = option
    } else {
      states.inputValue = ''
      states.selectedOption = null
    }
  }
)
const isDropdownShow = ref(false)
const popperOptions: any = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9]
      }
    },
    // https://github.com/floating-ui/floating-ui/issues/794
    {
      name: 'sameWidth',
      enabled: true,
      fn: ({ state }: { state: any }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`
      },
      phase: 'beforeWrite',
      requires: ['computeStyles']
    }
  ]
}

const findIndex = (value?: ValueType) => {
  return filteredOptions.value.findIndex((option) => option.value === value)
}

// 筛选
const filteredOptions = ref(props.options)
watch(
  () => props.options,
  (newOptions) => {
    filteredOptions.value = newOptions
  }
)
const generateFilteredOptions = async (searchVal: ValueType) => {
  if (!props.filterable) return
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(searchVal)
  } else if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    states.loading = true
    try {
      filteredOptions.value = await props.remoteMethod(searchVal + '')
    } catch (error) {
      console.error(error)
      filteredOptions.value = []
    } finally {
      states.loading = false
    }
  } else {
    filteredOptions.value = props.options.filter((option) => {
      if (typeof searchVal === 'string' && typeof option.label === 'string') {
        return option.label.includes(searchVal)
      }
      // 针对数字，清空的时候返回所有列表
      return !searchVal || option.label == searchVal
    })
  }
  states.highlightIndex = findIndex(states.selectedOption?.value)
}
const onFilter = (searchVal: ValueType) => {
  generateFilteredOptions(searchVal)
}
const filterPlaceholder = computed(() => {
  // 数字 需要转换为 string
  return props.filterable && states.selectedOption && isDropdownShow.value
    ? states.selectedOption.label + ''
    : props.placeholder
})
// 防抖 延时
const timeout = computed(() => (props.remote ? 300 : 0))
const debounceOnFilter = debounce(onFilter, timeout.value)

const controlDropdown = (show: boolean) => {
  if (show) {
    // filter 模式 清空 input
    if (props.filterable && states.selectedOption) {
      states.inputValue = ''
    }
    // 重新筛选
    if (props.filterable) {
      generateFilteredOptions(states.inputValue)
    }
    tooltipRef.value.show()
  } else {
    tooltipRef.value.hide()
    if (props.filterable) {
      states.inputValue = states.selectedOption ? states.selectedOption.label : ''
    }
    states.highlightIndex = findIndex(states.selectedOption?.value)
  }
  isDropdownShow.value = show
  emits('visible-change', show)
}
// 是否显示 选项列表
const toggleDropdown = () => {
  if (props.disabled) return
  if (isDropdownShow.value) {
    controlDropdown(false)
  } else {
    controlDropdown(true)
  }
}

// 清空的逻辑
const showClearIcon = computed(() => {
  return props.clearable && states.mouseHover && states.selectedOption && states.inputValue !== ''
})
const clear = () => {
  states.inputValue = ''
  states.selectedOption = null
  states.highlightIndex = -1
  emits('change', '')
  emits('update:modelValue', '')
  emits('clear')
  inputRef.value.ref.focus()
}
const NOOP = () => {}

const itemSelect = (e: SelectOption) => {
  if (e.disabled) return
  states.inputValue = e.label
  states.selectedOption = e
  emits('change', e.value)
  emits('update:modelValue', e.value)
  runValidation('change')
  controlDropdown(false)
  inputRef.value.ref.focus()
}

// 键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.code) {
    case 'Enter':
      // toggleDropdown();
      if (!isDropdownShow.value) {
        controlDropdown(true)
      } else {
        if (states.highlightIndex !== -1 && filteredOptions.value[states.highlightIndex]) {
          itemSelect(filteredOptions.value[states.highlightIndex])
        }
        controlDropdown(false)
      }
      break
    case 'Escape':
      if (isDropdownShow.value) {
        controlDropdown(false)
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (filteredOptions.value.length > 0) {
        if ([-1, 0].includes(states.highlightIndex)) {
          states.highlightIndex = filteredOptions.value.length - 1
        } else {
          states.highlightIndex--
          if (filteredOptions.value[states.highlightIndex].disabled) {
            states.highlightIndex--
          }
        }
      }
      break
    case 'ArrowDown':
      e.preventDefault()
      if (filteredOptions.value.length > 0) {
        if ([-1, filteredOptions.value.length - 1].includes(states.highlightIndex)) {
          states.highlightIndex = 0
        } else {
          states.highlightIndex++
          if (filteredOptions.value[states.highlightIndex].disabled) {
            states.highlightIndex++
          }
        }
      }
      break
    default:
      break
  }
}
</script>
