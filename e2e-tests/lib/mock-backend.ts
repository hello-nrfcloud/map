import { Context } from '@hello.nrfcloud.com/proto-map/api'
import type { IncomingMessage, ServerResponse } from 'http'
import type { Connect } from 'vite'
import type { Registry } from '../../src/context/Parameters.tsx'

export const mockBackend = ({
	registry,
}: {
	registry: Registry
}): Record<string, Connect.SimpleHandleFunction> => {
	let release = '0.0.0-development'
	return {
		'/e2e/registry.json': (req, res) =>
			sendJSON(res, generateRegistryResponse(registry)),
		'/e2e/api/devices': (req, res) =>
			sendJSON(res, {
				'@context': Context.devices,
				devices: [],
			}),
		'/e2e/api/thingyWorldShadows': (req, res) =>
			sendJSON(res, {
				'@context': Context.devices,
				devices: [],
			}),
		'/map/.well-known/release': (req, res) => {
			res.setHeader('Content-type', 'text/plain; charset=utf-8')
			res.write(release)
			res.end()
		},
		'/api/release': (req, res) => {
			if (req.method === 'PUT')
				req.on('data', (d) => {
					release = d.toString().trim()
				})
			res.statusCode = 202
			res.end()
		},
	}
}

const generateRegistryResponse = (
	registry: Registry,
): Registry & {
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
	console.debug(JSON.stringify(payload))
	res.setHeader('Content-type', 'application/json; charset=utf-8')
	res.write(JSON.stringify(payload))
	res.end()
}

const base = new URL('http://localhost:8080')
export const mockBackendApi = {
	setRelease: async (release: string): Promise<void> => {
		await fetch(new URL('/api/release', base), {
			method: 'PUT',
			body: release,
		})
	},
}
