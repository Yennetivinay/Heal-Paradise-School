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
    esbuildOptions: {
      target: 'esnext',
    },
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
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Multiple passes for better compression
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - optimized splitting
          if (id.includes('node_modules')) {
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
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router/')) {
              return 'react-vendor';
            }
            // Other vendor libraries
            return 'vendor';
          }
          // Page chunks - separate for better caching
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1]?.split('.')[0];
            if (pageName) {
              return `page-${pageName.toLowerCase()}`;
            }
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Disable source maps in production for smaller bundle
    sourcemap: false,
    // Enable compression
    reportCompressedSize: true,
    // Optimize asset inlining threshold (smaller = more inlining)
    assetsInlineLimit: 4096, // Increased for better caching
    // CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Minify CSS
    cssMinify: true,
    // Optimize for faster loads
    modulePreload: {
      polyfill: false, // Modern browsers don't need polyfill
    },
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 600,
  }
})
