import { type LwM2MObjectID } from '@hello.nrfcloud.com/proto-map'
import { ResourceHistory } from '@hello.nrfcloud.com/proto-map/api'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import type { Device } from './fetchDevices.js'

const fetchResourceHistory = typedFetch({
	responseBodySchema: ResourceHistory,
})

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
	async (): Promise<Static<typeof ResourceHistory>> => {
		const queryURL = new URL(
			`?${new URLSearchParams({
				deviceId: device.id,
				instance: `${ObjectID}/${InstanceID}`,
			}).toString()}`,
			url,
		)
		const res = await fetchResourceHistory(queryURL)
		if ('error' in res) {
			throw new Error(
				`Failed to fetch history (${queryURL.toString()}): ${JSON.stringify(res.error)}!`,
			)
		}
		return res.result
	}
