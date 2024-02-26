import type { ParentProps } from 'solid-js'
import { createResource, createContext, useContext, onCleanup } from 'solid-js'
import { useParameters } from './Parameters.js'
import { Devices, PublicDevice } from '@hello.nrfcloud.com/proto/hello/map'
import { type Static } from '@sinclair/typebox'
import { instanceTs } from '../util/instanceTs.js'

export type Device = Static<typeof PublicDevice> & {
	lastUpdate: Date | undefined
}

export const fetchDevices =
	(url: URL) => async (): Promise<Static<typeof Devices>> => {
		try {
			const res = await fetch(url)
			const devices = await res.json()
			return devices
		} catch (err) {
			throw new Error(
				`Failed to fetch devices (${url.toString()}): ${(err as Error).message}!`,
			)
		}
	}

export const DevicesProvider = (props: ParentProps) => {
	const parameters = useParameters()
	const [devicesResource, { refetch: refetchDevices }] = createResource(
		parameters,
		fetchDevices(parameters.devicesAPIURL),
	)
	const [thingyWorldDevicesResource, { refetch: refetchThingyWorldDevices }] =
		createResource(parameters, fetchDevices(parameters.thingyWorldShadowsURL))

	const i = setInterval(() => {
		void refetchDevices()
		void refetchThingyWorldDevices()
	}, 1000 * 60)

	onCleanup(() => {
		clearInterval(i)
	})

	return (
		<DevicesContext.Provider
			value={() =>
				[
					...(devicesResource()?.devices ?? []).map(addLastUpdated),
					...(thingyWorldDevicesResource()?.devices ?? []).map(addLastUpdated),
				].sort(byLastUpdated)
			}
		>
			{props.children}
		</DevicesContext.Provider>
	)
}

export const DevicesContext = createContext<() => Device[]>(() => [])

export const useDevices = () => useContext(DevicesContext)

export const byId =
	(search: string) =>
	({ id }: { id: string }) =>
		id === search

const addLastUpdated = (device: Static<typeof PublicDevice>): Device => ({
	...device,
	lastUpdate: (device.state ?? []).map(instanceTs).sort(desc)[0],
})

const desc = (d1: Date, d2: Date) => d2.getTime() - d1.getTime()

const byLastUpdated = (
	{ lastUpdate: u1 }: { lastUpdate: Date | undefined },
	{ lastUpdate: u2 }: { lastUpdate: Date | undefined },
): number => {
	const d1Update = u1?.getTime() ?? Number.MIN_SAFE_INTEGER
	const d2Update = u2?.getTime() ?? Number.MIN_SAFE_INTEGER
	return d2Update - d1Update
}
