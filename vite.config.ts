import svgr from '@honkhonk/vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import path from 'path'
import summary from 'rollup-plugin-summary'
import bundleVisualizer from 'rollup-plugin-visualizer'
import { defineConfig, Plugin } from 'vite'

import { dependencies } from './package.json'

const getBundleVisualizerPlugin = () =>
	({
		...bundleVisualizer({
			template: 'treemap', // or sunburst
			open: true,
			gzipSize: true,
			brotliSize: true,
		}),
		apply: 'build',
		enforce: 'post',
	} as Plugin)

const renderChunks = (deps: Record<string, string>) => {
	const chunks = {}

	Object.keys(deps).forEach((key) => {
		if (['react', 'react-router-dom', 'react-dom', 'lodash', 'rollup-plugin-summary'].includes(key)) return
		chunks[key] = [key]
	})
	return chunks
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		svgr(),
		// @ts-ignore
		summary({
			showBrotliSize: false,
		}),
		// uncomment this to analyze bundle
		// getBundleVisualizerPlugin(),
	],
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, '/src') }],
	},
	build: {
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-router-dom', 'react-dom'],
					...renderChunks(dependencies),
				},
				chunkFileNames: '[name].js',
			},
		},
	},
})
