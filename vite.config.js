import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Netlify/Cloudflare Pages serve this at the domain root, but GitHub Pages
  // serves project sites under /<repo-name>/ — only prefix paths for that build.
  base: process.env.GH_PAGES ? '/yildonumu/' : '/',
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
  },
})
