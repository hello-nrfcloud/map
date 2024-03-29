import { defineConfig, type PluginOption, type UserConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import {
	homepage,
	protoVersion,
	repositoryUrl,
	version,
} from './packageInfo.js'
import { encloseWithSlash } from '../src/util/encloseWithSlash.ts'

export const createConfig = (
	registryEndpoint: URL,
	base: string,
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
	}
	for (const [k, v] of Object.entries(define)) {
		console.debug(`[vite define] ${k}:`, v)
	}
	// https://vitejs.dev/config/
	return defineConfig({
		plugins: [solidPlugin(), ...plugins],
		base: baseSlashed,
		server: {
			host: 'localhost',
			port: 8080,
		},
		// string values will be used as raw expressions, so if defining a string constant, it needs to be explicitly quoted
		define,
	})
}
