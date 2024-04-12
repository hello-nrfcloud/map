export type DeviceCredentials = {
	'@context': 'https://github.com/hello-nrfcloud/proto-map/device-credentials'
	credentials: {
		privateKey: string
		certificate: string
	}
}
export const createCredentials =
	(url: URL, device: { deviceId: string }) =>
	async (): Promise<DeviceCredentials> => {
		try {
			return (
				await fetch(url, {
					method: 'POST',
					body: JSON.stringify({ deviceId: device.deviceId }),
				})
			).json()
		} catch (err) {
			throw new Error(
				`Failed to confirm sharing request for a device (${url.toString()}): ${(err as Error).message}!`,
			)
		}
	}
