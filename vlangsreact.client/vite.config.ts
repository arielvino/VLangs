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
                        // PDF.js - large library, only loaded when needed
                        if (id.includes('pdfjs-dist')) {
                            return 'pdf';
                        }
                        // Tesseract OCR - only loaded when needed
                        if (id.includes('tesseract.js')) {
                            return 'tesseract';
                        }
                        // Material UI icons - separate for better caching
                        if (id.includes('@mui/icons-material')) {
                            return 'mui-icons';
                        }
                        // Material UI core + Emotion (grouped together to avoid circular deps)
                        if (id.includes('@mui/') || id.includes('@emotion/')) {
                            return 'mui-core';
                        }
                        // React, ReactDOM, and related libraries
                        if (id.includes('react') || id.includes('scheduler')) {
                            return 'react-vendor';
                        }
                        // IDB and other utilities
                        if (id.includes('idb')) {
                            return 'utilities';
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
