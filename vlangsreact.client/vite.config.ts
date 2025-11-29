import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        host: true,
        port: 3000,
        strictPort: true,
        watch: {
            usePolling: true
        },
        proxy: {
            '^/api': {
                target: 'http://localhost:5000',
                secure: false
            }
        }
    },
    build: {
        rollupOptions: {
            plugins: [
                visualizer({
                    filename: 'stats.html',
                    template: 'treemap',
                    gzipSize: true,
                    brotliSize: true,
                }),
            ],
        },
    },
})
