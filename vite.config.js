import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'


export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production' || process.env.NODE_ENV === 'production';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  
  const base = (isProduction || isGitHubActions) ? '/speed-typing/' : '/';
  
  return {
    plugins: [vue(), svgLoader()],
    base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
  };
})
