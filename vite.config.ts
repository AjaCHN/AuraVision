import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Safely expose the API key to the client-side code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    // Provide a fallback for other process.env accesses to prevent crashes
    'process.env': {}
  }
})