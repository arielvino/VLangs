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
                        // Only split truly independent libraries to avoid circular dependencies
                        // PDF.js - large library, completely independent, only loaded when needed
                        if (id.includes('pdfjs-dist')) {
                            return 'pdf';
                        }
                        // Tesseract OCR - independent, only loaded when needed
                        if (id.includes('tesseract.js')) {
                            return 'tesseract';
                        }
                        // All React, MUI, and Emotion stay together to avoid circular deps
                        // This is safer than trying to split them
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
