import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  base: '/',
  plugins: [react()],
  css: {
    transformer: 'postcss',
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ]
    },
    // Prevent CSS code duplication and split files efficiently
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  build: {
    chunkSizeWarningLimit: 1000, // Safe threshold since vendors are isolated
    cssCodeSplit: true,          // Explicitly split CSS matching your JS chunks
    minify: 'esbuild',           // High performance minification
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Isolate individual heavyweight libraries
            if (id.includes('lucide-react')) return 'lucide-vendor';
            if (id.includes('framer-motion')) return 'motion-vendor';
            if (id.includes('axios')) return 'network-vendor';
            
            // Isolate core react library files entirely 
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'react-core';
            }
            
            return 'vendor'; // Generic fallback for smaller dependencies
          }
        }
      }
    }
  }
})