import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'


export default defineConfig(({ mode }) => ({
  plugins: [vue(), svgLoader()],
  base: mode === 'production' ? '/speed-typing/' : '/',
}))
