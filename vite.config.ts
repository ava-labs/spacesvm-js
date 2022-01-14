import svgr from '@honkhonk/vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import path from 'path'
import summary from 'rollup-plugin-summary'
import bundleVisualizer from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, Plugin } from 'vite'

import { dependencies } from './package.json'

const getBundleVisualizerPlugin = () =>
	({
		...bundleVisualizer({
			template: 'treemap', // or sunburst
			open: true,
			gzipSize: true,
		}),
		apply: 'build',
		enforce: 'post',
	} as Plugin)

const renderChunks = (deps: Record<string, string>) => {
	const chunks = {}

	Object.keys(deps).forEach((key) => {
		if (
			['react', 'react-router-dom', 'react-dom', 'lodash', 'rollup-plugin-summary', '@metamask/onboarding'].includes(
				key,
			)
		)
			return
		chunks[key] = [key]
	})
	return chunks
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		AutoImport({
			imports: [
				'react',
				{
					react: [
						// named imports
						'memo',
						'createContext',
					],
				},
			],
			dts: './src/auto-imports.d.ts',
			eslintrc: {
				enabled: true, // Default `false`
				filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
				globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
			},
		}),
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
