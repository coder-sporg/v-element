import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
// import App from './App1.vue'
// import App from './App2.vue'
// import App from './FormItemApp.vue'
// import App from './FormApp.vue'
// import './styles/index.css'
import App from './App.vue' // 测试组件

// 导入全部组件
// import VElement from './index'
// @ts-ignore
import VElement from '../dist/es/v-element.js'
import '../dist/index.css'

// 导入单个组件
// import { Button, Icon } from './index'

library.add(fas)

const app = createApp(App)
app.use(VElement)
// app.use(Button.install) // 单独引用
// app.use(Icon.install) // 单独引用
// app.component(Button.name!, Button) // 单独引用
app.mount('#app')
