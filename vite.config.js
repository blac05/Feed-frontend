import { defineConfig } from 'vite'
// Uncomment and import your framework plugin if needed
// import vue from '@vitejs/plugin-vue'
// import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'public', // your index.html is in the public folder
  // plugins: [vue()], // or [react()], depending on your framework
  build: {
    rollupOptions: {
      input: 'index.html', // relative to 'public' folder
    },
  },
});