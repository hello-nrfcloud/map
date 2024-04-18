import { ModelID } from '@hello.nrfcloud.com/proto-map'
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
