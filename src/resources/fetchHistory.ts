import {
	type LwM2MObjectID,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-map'
import type { Device } from './fetchDevices.js'

export const fetchHistory =
	(
		url: URL,
		{
			device,
			ObjectID,
			InstanceID,
		}: {
			device: Device
			InstanceID: number
			ObjectID: LwM2MObjectID
		},
	) =>
	async (): Promise<{
		// FIXME: add to proto-map
		'@context': 'https://github.com/hello-nrfcloud/proto-map/history'
		partialInstances: Array<LwM2MObjectInstance['Resources'] & { ts: string }>
		query: {
			InstanceID: number
			ObjectID: LwM2MObjectID
			ObjectVersion: string // e.g. '1.0'
			binIntervalMinutes: number // e.g. 15
			deviceId: string // e.g. 'pentacid-coxalgia-backheel'
		}
	}> => {
		const queryURL = new URL(
			`?${new URLSearchParams({
				deviceId: device.id,
				instance: `${ObjectID}/${InstanceID}`,
			}).toString()}`,
			url,
		)
		try {
			return (await fetch(queryURL)).json()
		} catch (err) {
			throw new Error(
				`Failed to fetch history (${queryURL.toString()}): ${(err as Error).message}!`,
			)
		}
	}
