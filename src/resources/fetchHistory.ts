import { ProblemDetailError } from '#component/notifications/Problem.tsx'
import { type LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { LwM2MObjectHistory, typedFetch } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import type { Device } from './fetchDevices.ts'
import { getDeviceJWT } from './getDeviceJWT.ts'

const fetchResourceHistory = typedFetch({
	responseBodySchema: LwM2MObjectHistory,
})

export const fetchHistory =
	({
		device,
		ObjectID,
		InstanceID,
	}: {
		device: Device
		InstanceID: number
		ObjectID: LwM2MObjectID
	}) =>
	async (): Promise<Static<typeof LwM2MObjectHistory>> => {
		const deviceJWT = await getDeviceJWT(new URL(API_URL), { device })()
		const queryURL = new URL(
			`./device/${device.deviceId}/history/${ObjectID}/${InstanceID}?${new URLSearchParams(
				{
					jwt: deviceJWT,
					timeSpan: 'lastDay',
				},
			).toString()}`,
			HELLO_API_URL,
		)
		const res = await fetchResourceHistory(queryURL)
		if ('error' in res) {
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
