<template>
  <div>
    <vk-button type="primary">Primary</vk-button>
    <vk-button round>Round Button</vk-button>
    <vk-button circle type="info">Cir</vk-button>
    <vk-button @click="handleClick">点击创建message</vk-button>
    <hr />
    <vk-icon icon="arrow-up" color="#0e7a0d" />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { createMessage } from '../dist/es/v-element.js'

const handleClick = () => {
  createMessage({ message: 'hello world', duration: 0, showClose: true })
  createMessage({ message: 'hello world', duration: 0, showClose: true, type: 'success' })
}
</script>
