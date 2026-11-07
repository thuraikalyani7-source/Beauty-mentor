import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import process from 'node:process'

const proxyErrorCodes = new Set(['ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH', 'ENETUNREACH', 'ETIMEDOUT', 'ECONNABORTED', 'EPIPE'])

function safeProxyErrorMessage(error) {
  const message = typeof error?.message === 'string' ? error.message : ''
  return message
    .replace(/AIza[\w-]{20,}/g, '[redacted]')
    .replace(/[\r\n\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 240) || 'Proxy connection failed; details unavailable.'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        configure(proxy) {
          proxy.on('error', (error, request) => {
            if (request.url?.split('?')[0] !== '/api/assistant/chat') return
            const code = proxyErrorCodes.has(error?.code) ? error.code : 'PROXY_ERROR'
            process.stderr.write(`[assistant proxy] route=/api/assistant/chat code=${code} message="${safeProxyErrorMessage(error)}"\n`)
          })
        },
      },
    },
  },
})
