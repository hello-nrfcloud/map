import { ProblemDetailError } from '#component/notifications/Problem.tsx'
import { DeviceIdentity, typedFetch } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'

export const fetchOOBDeviceInfo =
	(apiURL: URL) =>
	async (fingerprint: string): Promise<Static<typeof DeviceIdentity>> => {
		const res = await typedFetch({
			responseBodySchema: DeviceIdentity,
		})(
			new URL(
				`./device?${new URLSearchParams({ fingerprint }).toString()}`,
				apiURL,
			),
		)
		if ('error' in res) {
			console.error(res.error)
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
