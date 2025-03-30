import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  optimizeDeps: {
    exclude: [
      'crypto',
      'jsonwebtoken',
      'dotenv',
      'mongoose',
      'nodemailer',
      'fs',
      'path',
      'os',
      'stream',
      'http',
      'zlib',
      'util'
    ]
  },
  ssr: {
    noExternal: [
      'jsonwebtoken',
      'mongoose',
      'nodemailer'
    ]
  }
});