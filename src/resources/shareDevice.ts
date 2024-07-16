import { ShareDeviceRequest } from '@hello.nrfcloud.com/proto-map/api'
import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import { ProblemDetailError } from '../component/Problem.tsx'

const shareDeviceRequest = typedFetch({
	responseBodySchema: ShareDeviceRequest,
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
	async (req: ShareDevice): Promise<Static<typeof ShareDeviceRequest>> => {
		const res = await shareDeviceRequest(url, req, { method: 'POST' })
		if ('error' in res) {
			console.error(res.error)
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
