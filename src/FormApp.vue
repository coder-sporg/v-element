<script setup>
import { reactive, ref } from 'vue'
import Form from '@/components/Form/Form.vue'
import FormItem from '@/components/Form/FormItem.vue'
import Input from '@/components/Input/Input.vue'
import Button from '@/components/Button/Button.vue'
import Switch from '@/components/Switch/Switch.vue'
import Select from '@/components/Select/Select.vue'
const model = reactive({
  email: '666@qq.com',
  password: '',
  confirmPwd: '',
  agreement: false,
  zone: ''
})

const options = [
  { label: 'zone 1', value: 'one' },
  { label: 'zone 2', value: 'two' },
  { label: 'zone 3', value: 'three' }
]
const formRef = ref()
const submit = async () => {
  try {
    await formRef.value.validate()
  } catch (error) {
    console.warn(error)
  }
}
const reset = () => {
  formRef.value.resetFields()
}

const rules = {
  name: [
    { type: 'string', required: true, trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'input' }
  ],
  email: [
    { type: 'email', required: true, trigger: 'blur' },
    { type: 'string', required: true, trigger: 'change' }
  ],
  password: [
    { type: 'string', required: true, trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  confirmPwd: [
    { type: 'string', required: true, trigger: 'blur' },
    {
      validator: (rule, value) => value === model.password,
      trigger: 'blur',
      message: "Two inputs don't match!"
    }
  ],
  agreement: [{ type: 'enum', required: true, enum: [true], message: '请同意协议' }],
  zone: [{ type: 'string', required: true, trigger: 'change' }]
}
</script>

<template>
  <div class="form-wrap">
    <Form :model="model" :rules="rules" ref="formRef">
      <!-- <FormItem prop="name" label="enter your name" #default="{ validate }">
        <input
          v-model="model.name"
          @blur="validate('blur')"
          @input="validate('input')"
        />
      </FormItem> -->
      <FormItem prop="email" label="the email">
        <Input v-model="model.email" />
      </FormItem>
      <FormItem prop="password" label="the password">
        <!-- <template #label="{ label }">
          <Button type="success">{{ label }}</Button>
        </template> -->
        <Input v-model="model.password" type="password" />
      </FormItem>
      <FormItem prop="confirmPwd" label="confirm password">
        <Input v-model="model.confirmPwd" type="password" />
      </FormItem>
      <FormItem prop="agreement" label="agreement">
        <Switch v-model="model.agreement" />
      </FormItem>
      <FormItem prop="zone" label="zone">
        <Select v-model="model.zone" :options="options" />
      </FormItem>
      <FormItem>
        <Button @click.prevent="submit" type="primary">Submit</Button>
        <Button @click.prevent="reset">Reset</Button>
      </FormItem>
    </Form>

    <p>
      form value:
      {{ model }}
    </p>
  </div>
</template>

<style scoped>
.form-wrap {
  width: 500px;
  margin: 0 auto 20px;
  padding: 16px;
  background: #fafafa;
}
</style>
