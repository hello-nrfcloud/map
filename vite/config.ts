import { resolve } from 'node:path'
import { defineConfig, type PluginOption, type UserConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { encloseWithSlash } from '../src/util/encloseWithSlash.ts'
import { tutorialContentPlugin } from '../tutorial/tutorialContentPlugin.ts'
import {
	homepage,
	protoVersion,
	repositoryUrl,
	version,
} from './packageInfo.ts'

export const createConfig = (
	apiURL: URL,
	registryEndpoint: URL,
	base: string,
	map: {
		region: string
		apiKey: string
	},
	plugins: PluginOption[] = [],
): UserConfig => {
	const baseSlashed = encloseWithSlash(base)
	const define = {
		HOMEPAGE: JSON.stringify(homepage),
		VERSION: JSON.stringify(version),
		BUILD_TIME: JSON.stringify(new Date().toISOString()),
		REGISTRY_ENDPOINT: JSON.stringify(registryEndpoint.toString()),
		BASE_URL: JSON.stringify(baseSlashed),
		REPOSITORY_URL: JSON.stringify(repositoryUrl),
		PROTO_VERSION: JSON.stringify(protoVersion),
		API_URL: JSON.stringify(apiURL.toString()),
		MAP_REGION: JSON.stringify(map.region),
		MAP_API_KEY: JSON.stringify(map.apiKey),
	}
	for (const [k, v] of Object.entries(define)) {
		console.debug(`[vite define] ${k}:`, v)
	}
	// https://vitejs.dev/config/
	return defineConfig({
		plugins: [solidPlugin(), tutorialContentPlugin(), ...plugins],
		base: baseSlashed,
		preview: {
			host: 'localhost',
			port: 8080,
		},
		server: {
			host: 'localhost',
			port: 8080,
		},
		// string values will be used as raw expressions, so if defining a string constant, it needs to be explicitly quoted
		define,
		build: {
			rollupOptions: {
				input: {
					main: resolve(import.meta.dirname, '..', 'index.html'),
					dashboard: resolve(
						import.meta.dirname,
						'..',
						'dashboard',
						'index.html',
					),
				},
			},
			sourcemap: true,
		},
		optimizeDeps: {
			exclude: ['maplibre-gl'],
		},
		resolve: {
			alias: [
				{ find: '#dashboard/', replacement: '/src/dashboard/' },
				{ find: '#component/', replacement: '/src/component/' },
				{ find: '#context/', replacement: '/src/context/' },
				{ find: '#icons/', replacement: '/src/icons/' },
				{ find: '#map/', replacement: '/src/map/' },
				{ find: '#resources/', replacement: '/src/resources/' },
				{ find: '#util/', replacement: '/src/util/' },
			],
		},
	})
}
