<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import Input from './components/Input/Input.vue'
import Icon from './components/Icon/Icon.vue'
import Switch from './components/Switch/Switch.vue'
import Select from './components/Select/Select.vue'
import type { SelectOption } from './components/Select/types'

const baseInputValue = ref(555)
const textareaInputValue = ref('hello world')

const switchValue = ref(false)

const test = ref('')
const options = [
  { label: 'hello', value: '1' },
  { label: 'xyz', value: '2' },
  { label: 'testing', value: '3' },
  { label: 'check', value: '4', disabled: true }
]
const customRender = (option: SelectOption) => {
  return h('div', { className: 'xyz' }, [h('b', option.label), h('span', option.value)])
}

onMounted(() => {
  setTimeout(() => {
    options.push({ label: 'yyy', value: '5' })
    test.value = '3'
  }, 5000)
})

const selectNum = ref('')
const options2 = [
  { label: 0, value: 0 },
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 4, value: 4 }
]

const remoteVal = ref('')
const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
]

const remoteFilter = (query: string): Promise<SelectOption[]> => {
  return new Promise((resolve) => {
    if (query) {
      setTimeout(() => {
        const options = states
          .filter((item) => {
            return item.toLowerCase().includes(query.toLowerCase())
          })
          .map((label) => {
            return { label, value: label }
          })
        resolve(options)
      }, 500)
    } else {
      resolve([])
    }
  })
}
</script>
<template>
  <div class="input-wrapper">
    <span>{{ baseInputValue }}</span>
    <span>{{ textareaInputValue }}</span>
    <span>{{ test }}</span>
  </div>
  <div class="input-wrapper">
    <Input v-model="baseInputValue" placeholder="基础文本框，请输入" clearable />
    <Input v-model="baseInputValue" placeholder="密码框" show-password />
    <Input v-model="baseInputValue" placeholder="禁用状态" disabled />
    <Input v-model="textareaInputValue" type="textarea" placeholder="文本域" />
    <Input v-model="baseInputValue" placeholder="prepend append">
      <template #prepend>Https://</template>
      <template #append>.com</template>
    </Input>

    <Input v-model="baseInputValue" placeholder="prefix suffix">
      <template #prefix>
        <Icon icon="magnifying-glass" />
      </template>
    </Input>
    <Input v-model="baseInputValue" placeholder="prefix suffix">
      <template #suffix>
        <Icon icon="magnifying-glass" />
      </template>
    </Input>
  </div>
  <div class="input-wrapper">
    <Switch v-model="switchValue" />
    <Switch v-model="switchValue" activeText="ON" inactiveText="OFF" />
  </div>
  <div class="select-wrapper">
    <Select
      style="width: 240px"
      v-model="test"
      placeholder="基础选择器，请选择"
      :options="options"
    />
    <Select style="width: 240px" v-model="test" placeholder="Select" :options="options" clearable />
    <Select
      style="width: 240px"
      v-model="test"
      placeholder="Select"
      :options="options"
      clearable
      :render-label="customRender"
    />
    <Select
      style="width: 240px"
      v-model="selectNum"
      placeholder="支持数字选择"
      :options="options2"
      filterable
      clearable
    />
    <Select
      style="width: 240px"
      v-model="test"
      placeholder="支持筛选"
      :options="options"
      filterable
      clearable
    />
    <Select
      style="width: 240px"
      v-model="remoteVal"
      placeholder="搜索远程结果"
      filterable
      remote
      :remote-method="remoteFilter"
    />
    <Select style="width: 240px" v-model="test" placeholder="请选择" :options="options" disabled />
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  align-items: start;
  flex-wrap: wrap;
  gap: 16px;
  width: 400px;
}

.input-wrapper + .input-wrapper {
  margin-top: 16px;
}

.select-wrapper {
  margin-top: 16px;
  display: flex;
  align-items: start;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
<style>
.vk-select__menu-item,
.xyz {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
