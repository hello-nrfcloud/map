import { fromEnv } from '@nordicsemiconductor/from-env'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { trimTrailingSlash } from './src/util/trimTrailingSlash.js'
import pJson from './package.json'

const {
	version: defaultVersion,
	homepage,
	repository: { url: repositoryUrl },
	dependencies,
} = pJson
const version = process.env.VERSION ?? defaultVersion
const protoVersion = `v${dependencies['@hello.nrfcloud.com/proto-map']}`
const { registryEndpoint } = fromEnv({
	registryEndpoint: 'REGISTRY_ENDPOINT',
})(process.env)

const base = trimTrailingSlash(process.env.BASE_URL ?? '/map/')

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [solidPlugin()],
	base,
	preview: {
		host: 'localhost',
		port: 8080,
	},
	server: {
		host: 'localhost',
		port: 8080,
	},
	// string values will be used as raw expressions, so if defining a string constant, it needs to be explicitly quoted
	define: {
		HOMEPAGE: JSON.stringify(homepage),
		VERSION: JSON.stringify(version ?? Date.now()),
		BUILD_TIME: JSON.stringify(new Date().toISOString()),
		REGISTRY_ENDPOINT: JSON.stringify(new URL(registryEndpoint).toString()),
		BASE_URL: JSON.stringify(base),
		REPOSITORY_URL: JSON.stringify(repositoryUrl.replace('git+', '')),
		PROTO_VERSION: JSON.stringify(protoVersion),
	},
})
