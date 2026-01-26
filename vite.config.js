import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'


export default defineConfig(({ mode }) => {
  // Always use base path for production builds (GitHub Pages)
  // For local dev, you can override by running: npm run dev -- --base /
  // GitHub Actions automatically sets GITHUB_ACTIONS=true
  const isProduction = mode === 'production' || process.env.NODE_ENV === 'production';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  
  // Use base path for production builds (including GitHub Actions)
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
