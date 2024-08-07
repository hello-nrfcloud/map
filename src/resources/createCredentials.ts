import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import { DeviceCredentials } from '@hello.nrfcloud.com/proto-map/api'
import type { Static } from '@sinclair/typebox'
import { ProblemDetailError } from '#component/Problem.js'

const fetchCredentials = typedFetch({
	responseBodySchema: DeviceCredentials,
})

export const createCredentials =
	(url: URL, device: { deviceId: string }) =>
	async (): Promise<Static<typeof DeviceCredentials>> => {
		const res = await fetchCredentials(
			url,
			{ deviceId: device.deviceId },
			{ method: 'POST' },
		)
		if ('error' in res) {
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
