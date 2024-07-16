import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import type { ShareDeviceRequest } from '@hello.nrfcloud.com/proto-map/api'
import type { Static } from '@sinclair/typebox'

export type ShareDevice = {
	email: string
} & (
	| {
			model: ModelID
	  }
	| {
			fingerprint: string
	  }
)
export const shareDevice =
	(url: URL) =>
	async (req: ShareDevice): Promise<Static<typeof ShareDeviceRequest>> => {
		// Use similar approach as in

		/*
		const res = await deviceInfoFetcher(
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
		*/

		try {
			return (
				await fetch(url, {
					method: 'POST',
					body: JSON.stringify(req),
				})
			).json()
		} catch (err) {
			throw new Error(
				`Failed to add a device (${url.toString()}): ${(err as Error).message}!`,
			)
		}
	}
