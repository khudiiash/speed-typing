import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'


export default defineConfig(({ mode }) => {
  
  
  const base = process.env.GITHUB_PAGES === 'true' || mode === 'production' 
    ? '/speed-typing/' 
    : '/';
  
  return {
    plugins: [vue(), svgLoader()],
    base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
  };
})
