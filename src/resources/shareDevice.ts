import { ProblemDetailError } from '#component/notifications/Problem.tsx'
import { PublicDevice } from '@hello.nrfcloud.com/proto-map/api'
import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'

export const shareDevice =
	(apiURL: URL) =>
	async ({
		fingerprint,
		model,
		jwt,
	}: {
		fingerprint: string
		model: ModelID
		jwt: string
	}): Promise<Static<typeof PublicDevice>> => {
		const res = await typedFetch({
			responseBodySchema: PublicDevice,
		})(
			new URL(`./share`, apiURL),
			{
				fingerprint,
				model,
			},
			{ method: 'POST', headers: { Authorization: `Bearer ${jwt}` } },
		)
		if ('error' in res) {
			console.error(res.error)
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
