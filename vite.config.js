// vite.config.js
export default {
  root: 'public', // path to your index.html
}import { defineConfig } from 'vite'
// Uncomment if using Vue or React
// import vue from '@vitejs/plugin-vue'
// import react from '@vitejs/plugin-react'

export default defineConfig({
  // plugins: [vue()], // or [react()], depending on your framework
  build: {
    rollupOptions: {
      input: 'index.html', // Ensure this path is correct relative to the project root
    },
  },
});