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
        target: 'es2020',
        cssCodeSplit: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        // Split large libraries into separate chunks
                        if (id.includes('@mui/material') || id.includes('@mui/system') || id.includes('@emotion')) {
                            return 'mui-core';
                        }
                        if (id.includes('@mui/icons-material')) {
                            return 'mui-icons';
                        }
                        if (id.includes('pdfjs-dist')) {
                            return 'pdf';
                        }
                        if (id.includes('tesseract')) {
                            return 'tesseract';
                        }
                        if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                            return 'react-vendor';
                        }
                    }
                },
            },
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
