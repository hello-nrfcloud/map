import { PublicDevice } from '@hello.nrfcloud.com/proto-map/api'
import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import { ProblemDetailError } from '#component/Problem.js'

const publicDevice = typedFetch({
	responseBodySchema: PublicDevice,
})

export type ShareDevice = {
	email: string
} & (
	| {
			model: ModelID
	  }
	| {
			fingerprint: string
			model: ModelID
	  }
)
export const shareDevice =
	(url: URL) =>
	async (req: ShareDevice): Promise<Static<typeof PublicDevice>> => {
		const res = await publicDevice(url, req, { method: 'POST' })
		if ('error' in res) {
			console.error(res.error)
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
