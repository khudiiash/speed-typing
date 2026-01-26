import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'


export default defineConfig(({ mode }) => {
  // Always use base path for production builds (GitHub Pages)
  // For local dev, you can override by running: npm run dev -- --base /
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
