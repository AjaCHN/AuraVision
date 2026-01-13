import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    base: './', // Ensure relative paths for assets
    build: {
      outDir: 'build', // Output to 'build' folder instead of 'dist' for compatibility
    },
    define: {
      // Safely inject API Key from the loaded environment variables
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
      // Do NOT define 'process.env': {} as it breaks libraries relying on process.env.NODE_ENV
    }
  }
})