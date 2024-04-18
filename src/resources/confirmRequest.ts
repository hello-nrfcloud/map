import type {
	ShareDeviceRequest,
	ShareDeviceOwnershipConfirmed,
} from '@hello.nrfcloud.com/proto-map/api'
import type { Static } from '@sinclair/typebox'
export const confirmRequest =
	(url: URL, request: Static<typeof ShareDeviceRequest>) =>
	async (
		token: string,
	): Promise<Static<typeof ShareDeviceOwnershipConfirmed>> => {
		try {
			return (
				await fetch(url, {
					method: 'POST',
					body: JSON.stringify({ deviceId: request.deviceId, token }),
				})
			).json()
		} catch (err) {
			throw new Error(
				`Failed to confirm sharing request for a device (${url.toString()}): ${(err as Error).message}!`,
			)
		}
	}
