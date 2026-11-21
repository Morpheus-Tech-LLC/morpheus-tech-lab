import { defineConfig } from 'vite'

export default defineConfig({
  // Served from the root of lab.morpheustech.net (public/CNAME), not from
  // a github.io project path.
  base: '/',
  // Fixed port 5180 for dev and preview. Loopback only.
  server: { port: 5180, strictPort: true },
  preview: { port: 5180, strictPort: true },
  // Keep the bundled libraries' licence comments, such as three.js's MIT
  // notice, in the shipped JS: Vite's default strips them.
  esbuild: { legalComments: 'inline' },
})
