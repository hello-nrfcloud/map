import type { Plugin } from 'vite'
import type { Parameters } from '../src/context/Parameters.js'
import type { IncomingMessage, ServerResponse } from 'http'
import { Context } from '@hello.nrfcloud.com/proto/hello'

export const testdataServerPlugin = ({
	registry,
}: {
	registry: Parameters
}): Plugin => ({
	name: 'testdata-server',
	configureServer: (server) => {
		server.middlewares.use((req, res, next) => {
			if ((req.url?.startsWith('/e2e/') ?? false) === false) return next()
			if (req.url === '/e2e/registry.json') {
				return sendJSON(res, generateRegistryResponse(registry))
			}
			if (req.url === '/e2e/api/devices') {
				return sendJSON(res, {
					'@context': Context.map.devices,
					devices: [],
				})
			}
			if (req.url === '/e2e/api/thingyWorldShadows') {
				return sendJSON(res, {
					'@context': Context.map.devices,
					devices: [],
				})
			}
			return next()
		})
	},
})

const generateRegistryResponse = (
	registry: Parameters,
): Parameters & {
	'@ts': string // e.g. '2024-03-06T14:42:12.690Z'
	'@version': 1
	'@context': 'https://github.com/hello-nrfcloud/public-parameter-registry-aws-js'
} => ({
	'@version': 1,
	'@ts': new Date().toISOString(),
	'@context':
		'https://github.com/hello-nrfcloud/public-parameter-registry-aws-js',
	...registry,
})

const sendJSON = (
	res: ServerResponse<IncomingMessage>,
	payload: Record<string, unknown>,
): void => {
	res.setHeader('Content-type', 'application/json; charset=utf-8')
	res.write(JSON.stringify(payload))
	res.end()
}
