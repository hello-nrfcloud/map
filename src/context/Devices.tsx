import type { ParentProps } from 'solid-js'
import { createResource, createContext, useContext } from 'solid-js'
import { useParameters } from './Parameters.js'
import { Devices, PublicDevice } from '@hello.nrfcloud.com/proto/hello/map'
import { type Static } from '@sinclair/typebox'

export type Device = Static<typeof PublicDevice>

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
	const [devicesResource] = createResource(
		parameters,
		fetchDevices(parameters.devicesAPIURL),
	)

	return (
		<DevicesContext.Provider value={() => devicesResource()?.devices ?? []}>
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
