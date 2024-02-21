import { fromEnv } from '@nordicsemiconductor/from-env'
import fs from 'fs'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import path from 'node:path'

const { version: defaultVersion, homepage } = JSON.parse(
	fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
)
const version = process.env.VERSION ?? defaultVersion
const { registryEndpoint } = fromEnv({
	registryEndpoint: 'REGISTRY_ENDPOINT',
})(process.env)

const base = `${(process.env.BASE_URL ?? '').replace(/\/+$/, '')}/`

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
	},
})
