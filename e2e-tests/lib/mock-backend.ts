import { Context } from '@hello.nrfcloud.com/proto-map/api'
import { Context as HelloContext } from '@hello.nrfcloud.com/proto/hello'
import type { IncomingMessage, ServerResponse } from 'http'
import type { Connect } from 'vite'
import type { Registry } from '../../src/context/Parameters.tsx'

const deviceIdentities: Record<string, string> = {}

export const mockBackend = ({
	registry,
}: {
	registry: Registry
}): Record<string, Connect.SimpleHandleFunction> => {
	let release = '0.0.0-development'
	return {
		'GET /e2e/registry.json': (req, res) =>
			sendJSON(res, generateRegistryResponse(registry)),
		'GET /e2e/api/health': (req, res) =>
			sendJSON(res, {
				'@context': Context.apiHealth,
				version: '0.0.0-development',
			}),
		'GET /e2e/api/devices': (req, res) =>
			sendJSON(res, {
				'@context': Context.devices,
				devices: [],
			}),
		'GET /e2e/hello-api/device': (req, res) => {
			const fingerprint = new URLSearchParams(
				req.originalUrl?.split('?')[1],
			).get('fingerprint')
			if (fingerprint === null) return anError(res, 400)
			if (deviceIdentities[fingerprint] === undefined) {
				deviceIdentities[fingerprint] =
					`oob-${352656166600000 + Math.floor(Math.random() * 100_000)}`
			}
			return sendJSON(res, {
				'@context': HelloContext.deviceIdentity,
				id: deviceIdentities[fingerprint],
				model: 'thingy91x',
			})
		},
		'GET /map/.well-known/release': (req, res) => {
			res.setHeader('Content-type', 'text/plain; charset=utf-8')
			res.write(release)
			res.end()
		},
		// Modifies the internal state of the mock backend
		'PUT /api/release': (req, res) => {
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
	const payloadJSON = JSON.stringify(payload)
	console.debug(`>`, payloadJSON)
	res.setHeader('Content-type', 'application/json; charset=utf-8')
	res.setHeader('Content-length', payloadJSON.length.toString())
	res.write(payloadJSON)
	res.end()
}

const base = new URL('http://localhost:8080/				')
export const mockBackendApi = {
	setRelease: async (release: string): Promise<void> => {
		try {
			const url = new URL('/api/release', base)
			console.debug(`Setting release to ${release}`, url.toString())
			await fetch(url, {
				method: 'PUT',
				body: release,
			})
		} catch (err) {
			console.error(err)
			throw err
		}
	},
}

export const anError = (
	res: ServerResponse<IncomingMessage>,
	statusCode: number,
): void => {
	res.statusCode = statusCode
	res.end()
}
