import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import path from 'node:path'

export const testdataServerPlugin = (): Plugin => ({
	name: 'testdata-server',
	configureServer: (server) => {
		server.middlewares.use((req, res, next) => {
			if ((req.url?.startsWith('/e2e/') ?? false) === false) return next()
			if (req.url === '/e2e/registry.json') {
				res.setHeader('Content-type', 'application/json; charset=utf-8')
				res.write(
					readFileSync(path.join(process.cwd(), 'e2e-tests', 'registry.json')),
				)
				res.end()
				return
			}
			return next()
		})
	},
})
