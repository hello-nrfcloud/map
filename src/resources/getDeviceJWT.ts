import {
	Context,
	DeviceId,
	Model,
	PublicDeviceId,
} from '@hello.nrfcloud.com/proto-map/api'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import { Type } from '@sinclair/typebox'
import { ProblemDetailError } from '../component/Problem.tsx'
import type { Device } from './fetchDevices.js'

const deviceJWT = typedFetch({
	responseBodySchema: Type.Object({
		'@context': Type.Literal(Context.named('jwt').toString()),
		jwt: Type.String(),
		id: PublicDeviceId,
		deviceId: DeviceId,
		model: Model,
	}),
})

export const getDeviceJWT =
	(
		apiUrl: URL,
		{
			device,
		}: {
			device: Device
		},
	) =>
	async (): Promise<{
		jwt: string
		deviceId: string
	}> => {
		const queryURL = new URL(
			`./device/${encodeURIComponent(device.id)}/jwt`,
			apiUrl,
		)
		const res = await deviceJWT(queryURL)
		if ('error' in res) {
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
