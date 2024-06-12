import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx()
      }
    }),
    dts({
      tsconfigPath: './tsconfig.build.json',
      outDir: 'dist/types'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist/es',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VElement',
      fileName: 'v-element',
      formats: ['es']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        'vue',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@popperjs/core',
        'async-validator',
        'lodash-es'
      ],
      output: {
        assetFileNames(chunkInfo) {
          // 处理静态资源文件名
          if (chunkInfo.name === 'style.css') {
            return 'index.css'
          }
          return chunkInfo.name as string
        }
      }
    }
  }
})
