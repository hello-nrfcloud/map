import { type LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { typedFetch, LwM2MObjectHistory } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import type { Device } from './fetchDevices.js'
import { getDeviceJWT } from './getDeviceJWT.js'
import type { Parameters } from '#context/Parameters.js'
import { ProblemDetailError } from '#component/notifications/Problem.tsx'

const fetchResourceHistory = typedFetch({
	responseBodySchema: LwM2MObjectHistory,
})

export const fetchHistory =
	(
		{ apiURL, helloApiURL }: Parameters,
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
	async (): Promise<Static<typeof LwM2MObjectHistory>> => {
		const deviceJWT = await getDeviceJWT(apiURL, { device })()
		const queryURL = new URL(
			`./device/${device.deviceId}/history/${ObjectID}/${InstanceID}?${new URLSearchParams(
				{
					jwt: deviceJWT,
					timeSpan: 'lastDay',
				},
			).toString()}`,
			helloApiURL,
		)
		const res = await fetchResourceHistory(queryURL)
		if ('error' in res) {
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
