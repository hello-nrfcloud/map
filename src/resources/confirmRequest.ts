import type { ShareDeviceRequest } from './shareDevice.ts'

export type OwnershipConfirmed = {
	'@context': 'https://github.com/hello-nrfcloud/proto-map/share-device-ownership-confirmed'
	// Public ID
	id: string // e.g. "driveway-addition-fecifork"
}
export const confirmRequest =
	(url: URL, request: ShareDeviceRequest) =>
	async (token: string): Promise<OwnershipConfirmed> => {
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
