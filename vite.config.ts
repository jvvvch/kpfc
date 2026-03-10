import path from 'node:path';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        preact(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
            manifest: {
                name: 'kpfc',
                short_name: 'kpfc',
                description: 'Local food tracking app',
                icons: [
                    {
                        "src": "pwa-64x64.png",
                        "sizes": "64x64",
                        "type": "image/png"
                    },
                    {
                        "src": "pwa-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "pwa-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    },
                    {
                        "src": "maskable-icon-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable"
                    }
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,wasm,png,svg}'],
                navigateFallback: '/index.html',
            },
        }),
    ],

    build: {
        modulePreload: { polyfill: false },
        rollupOptions: {
            output: {
                assetFileNames: ({ names }) => {
                    if (names.includes('sqlite3.wasm')) {
                        return 'assets/[name].[ext]';
                    }
                    return 'assets/[name]-[hash].[ext]';
                },
            },
        },
    },

    worker: {
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },

    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
    },

    optimizeDeps: {
        exclude: ['@sqlite.org/sqlite-wasm'],
    },
});
