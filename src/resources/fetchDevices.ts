import { Devices, PublicDevice } from '@hello.nrfcloud.com/proto/hello/map'
import { type Static } from '@sinclair/typebox'

export type Device = Static<typeof PublicDevice> & {
	lastUpdate: Date | undefined
}

export const fetchDevices =
	(url: URL) => async (): Promise<Static<typeof Devices>> => {
		try {
			return (await fetch(url)).json()
		} catch (err) {
			throw new Error(
				`Failed to fetch devices (${url.toString()}): ${(err as Error).message}!`,
			)
		}
	}
