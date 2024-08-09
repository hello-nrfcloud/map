import { randomWords } from '@bifravst/random-words'
import { Context } from '@hello.nrfcloud.com/proto-map/api'
import { models } from '@hello.nrfcloud.com/proto-map/models'
import { Context as HelloContext } from '@hello.nrfcloud.com/proto/hello'
import { randomUUID } from 'crypto'
import type { IncomingMessage, ServerResponse } from 'http'
import type http from 'node:http'
import type { Connect } from 'vite'
import type { Registry } from '../../src/context/Parameters.tsx'

const deviceIdentities: Record<string, string> = {}
const publicDeviceIds: Record<string, string> = {}

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
		'POST /e2e/hello-api/device': async (req, res) => {
			const { model } = await getJSON(req)
			if (models[model as keyof typeof models] === undefined) {
				return anError(res, 404)
			}
			const deviceId = `map-${randomUUID()}`
			const id = randomWords({ numWords: 3 }).join('-')
			publicDeviceIds[deviceId] = id
			return sendJSON(res, {
				'@context': Context.deviceCredentials,
				id,
				deviceId,
				credentials: {
					privateKey:
						'-----BEGIN EC PARAMETERS-----\nBggqhkjOPQMBBw==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIPNcuCy4y43fPGtHxq0AiGYwSvJPirXcCj4cliygqtdzoAoGCCqGSM49\nAwEHoUQDQgAEB+ncfpi/uyldBKqbLIJsDvRtSS2cqJnyfI7GF9Zc4KFRvF4mINvB\ngLrp/pZNIeIrzzV8G044HA9qCatwG6102g==\n-----END EC PRIVATE KEY-----\n',
					certificate:
						'-----BEGIN CERTIFICATE-----\nMIICpDCCAYwCFC5OocBF2B2SZoQg2kQDNyP3zt97MA0GCSqGSIb3DQEBCwUAMIGy\nMQswCQYDVQQGEwJOTzESMBAGA1UECAwJVHJvbmRlbGFnMRIwEAYDVQQHDAlUcm9u\nZGhlaW0xITAfBgNVBAoMGE5vcmRpYyBTZW1pY29uZHVjdG9yIEFTQTEbMBkGA1UE\nCwwSaGVsbG8ubnJmY2xvdWQuY29tMQ8wDQYDVQQDDAZEZXZpY2UxKjAoBgkqhkiG\n9w0BCQEWG21hcmt1cy50YWNrZXJAbm9yZGljc2VtaS5ubzAgFw0yNDA4MDkxNDM4\nNDZaGA8yMDU0MDgwOTE0Mzg0NlowMzExMC8GA1UEAwwobWFwLTJkZWFkODJhLTU4\nODItNDRiZi1iZjBhLWFiNDVjNjAzMDE1NzBZMBMGByqGSM49AgEGCCqGSM49AwEH\nA0IABAfp3H6Y* TLSv1.2 (IN), TLS header, Supplemental data (23):v7spXQSqmyyCbA70bUktnKiZ8nyOxhfWXOChUbxeJiDbwYC66f6W\nTSHiK881fBtOOBwPagmrcButdNowDQYJKoZIhvcNAQELBQADggEBABIbSVo1CEc6\n2PYbvK+pkdZWfpL5gojg/iVqL1lcaVcfnVBeCFg+Qoviba/xDQ7aSyDIkv1xYgbt\nSyVY4vNy1NxKsTcBNngI3p3ztEjtMdeU2l9+rkX4eMIfT4oiN1fAGJzRIf38WH1C\nkrRRVpgeNGl02iaAGMg2g+uV8nv3w2iFaAF5T/YwyaPIBwRvG7VGAGLy4KrMHai4\neyS/riI6iKy9ddT2KRoX8bZP+qWt0acIbfexaUaC3CsuQ4guwYUcBXkVOr8FruEL\n3zboLa6AfS3NIoL61JsqxYHHweNwbLIykgFBcTaKHdpUzdiUP4H08sOKud4EkFf/\nOp1D0w47Mk8=\n-----END CERTIFICATE-----\n',
				},
			})
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

const getJSON = async (
	req: http.IncomingMessage,
): Promise<Record<string, any>> =>
	new Promise((resolve, reject) => {
		let requestData = ''
		req.on('data', (data) => {
			requestData += data
		})
		req.on('end', () => {
			try {
				const jsonData = JSON.parse(requestData)
				resolve(jsonData)
			} catch (error) {
				reject(error)
			}
		})
	})
