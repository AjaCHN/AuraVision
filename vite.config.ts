/**
 * File: vite.config.ts
 * Version: 0.7.5
 * Author: Aura Vision Team
 * Copyright (c) 2024 Aura Vision. All rights reserved.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'build', // Changed to 'build' to match documentation and standard deployment expectations
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false
  },
  define: {
    // 注入环境变量，如果 process.env.API_KEY 不存在则回退为空字符串
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
})