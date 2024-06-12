import type { App } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/Button'
import Collapse, { CollapseItem } from '@/components/Collapse'
import Dropdown from '@/components/Dropdown'
import Icon from '@/components/Icon'
import Tooltip from '@/components/Tooltip'
import Message, { createMessage, closeAll as closeAllMessages } from '@/components/Message'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Switch from '@/components/Switch'
import Form, { FormItem } from '@/components/Form'

import './styles/index.css'

// 引入图标
library.add(fas)

const components = [
  Button,
  Collapse,
  CollapseItem,
  Dropdown,
  Icon,
  Tooltip,
  Message,
  Input,
  Select,
  Switch,
  Form,
  FormItem
]

const install = (app: App) => {
  components.forEach((component) => {
    app.component(component.name!, component)
  })
}

export {
  Button,
  Collapse,
  CollapseItem,
  Dropdown,
  Icon,
  Tooltip,
  Message,
  Input,
  Select,
  Switch,
  Form,
  FormItem,
  createMessage,
  closeAllMessages
}
export default install
