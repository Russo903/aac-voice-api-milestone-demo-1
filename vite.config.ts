import {defineConfig, searchForWorkspaceRoot} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        '/Users/ginorusso_1/capstone-project/project-001-aac-api/dist/whisper/libstream.wasm',
        '/home/mcolbert/cis4398/project-001-aac-api/dist/whisper/libstream.wasm',
      ]
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    open: true,
  },
  optimizeDeps: {
    exclude: ['aac-voice-api'] // Don't pre-bundle your package during dev
  }
})
