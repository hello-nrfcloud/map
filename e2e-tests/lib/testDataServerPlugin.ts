import type { Plugin } from 'vite'
import type { Registry } from '../../src/context/Parameters.js'
import { mockBackend } from './mock-backend.ts'

export const testdataServerPlugin = ({
	registry,
}: {
	registry: Registry
}): Plugin => ({
	name: 'testdata-server',
	configureServer: (server) => {
		Object.entries(mockBackend({ registry })).forEach(([route, handler]) =>
			server.middlewares.use(route, handler),
		)
	},
})
