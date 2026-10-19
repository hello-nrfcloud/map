import type { IncomingMessage, ServerResponse } from 'http'
import type { Connect, Plugin } from 'vite'
import { mockBackend } from './mock-backend.ts'

export const testdataServerPlugin = (): Plugin => ({
	name: 'testdata-server',
	configureServer: (server) => {
		Object.entries(mockBackend()).forEach(([route, handler]) => {
			const [method, path] = route.split(' ')
			if (method === undefined || path === undefined)
				throw new Error(`Route ${route} does not specify method and path!`)
			return server.middlewares.use(path, checkMethod(method)(handler))
		})
	},
})

const checkMethod =
	(method: string) =>
	(handler: Connect.SimpleHandleFunction) =>
	(req: IncomingMessage, res: ServerResponse) => {
		if (req.method !== method) {
			res.statusCode = 405
			res.end()
			return
		}
		handler(req, res)
	}
