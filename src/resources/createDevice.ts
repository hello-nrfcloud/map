import { ProblemDetailError } from '#component/notifications/Problem.tsx'
import { DeviceCredentials } from '@hello.nrfcloud.com/proto-map/api'
import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'

export const createDevice =
	(apiURL: URL) =>
	async ({
		model,
		jwt,
	}: {
		model: ModelID
		jwt: string
	}): Promise<Static<typeof DeviceCredentials>> => {
		const res = await typedFetch({
			responseBodySchema: DeviceCredentials,
		})(
			new URL('./device', apiURL),
			{ model },
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			},
		)
		if ('error' in res) {
			console.error(res.error)
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
