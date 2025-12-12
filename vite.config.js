import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react({
      // Remove StrictMode in production for better performance
      jsxRuntime: 'automatic',
    }), 
    tailwindcss()
  ],
  server: {
    historyApiFallback: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lenis'], // Lazy load Lenis
  },
  // For production build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('lucide-react')) {
              return 'lucide-icons';
            }
            if (id.includes('lottie') || id.includes('dotlottie')) {
              return 'lottie';
            }
            if (id.includes('lenis')) {
              return 'lenis';
            }
          }
          // Page chunks - separate for better caching
          if (id.includes('/Pages/')) {
            const pageName = id.split('/Pages/')[1]?.split('.')[0];
            if (pageName) {
              return `page-${pageName.toLowerCase()}`;
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Disable source maps in production for smaller bundle
    sourcemap: false,
    // Enable compression
    reportCompressedSize: true,
    // Optimize asset inlining threshold
    assetsInlineLimit: 4096,
  }
})
