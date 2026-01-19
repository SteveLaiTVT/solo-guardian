/**
 * @file vite.config.ts
 * @description Vite configuration with code splitting for reduced bundle size
 * @task TASK-101
 * @design_state_version 3.12.0
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': ['@radix-ui/react-slot', '@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-label'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-i18n': ['i18next', 'react-i18next'],
        },
      },
    },
  },
})
