import { ModelID } from '@hello.nrfcloud.com/proto-map'

export type ShareDevice = {
	email: string
	model: ModelID
}
export type ShareDeviceRequest = {
	'@context': 'https://github.com/hello-nrfcloud/proto-map/share-device-request'
	// This is the public ID, as it will appear on the map
	id: string // e.g. 'driveway-addition-fecifork'

	// This is the secret device ID, which will be used by the device to connect
	deviceId: string // 'map-6ba03279-2d08-4a3c-bb05-1a88889465af'
}
export const shareDevice =
	(url: URL) =>
	async ({ email, model }: ShareDevice): Promise<ShareDeviceRequest> => {
		try {
			return (
				await fetch(url, {
					method: 'POST',
					body: JSON.stringify({ email, model }),
				})
			).json()
		} catch (err) {
			throw new Error(
				`Failed to add a device (${url.toString()}): ${(err as Error).message}!`,
			)
		}
	}
