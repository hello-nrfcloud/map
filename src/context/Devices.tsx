import type { ParentProps } from 'solid-js'
import {
	createEffect,
	createResource,
	createContext,
	useContext,
	onCleanup,
} from 'solid-js'
import { useParameters } from './Parameters.js'
import type { PublicDevice } from '@hello.nrfcloud.com/proto-map/api'
import { type Static } from '@sinclair/typebox'
import { createStore, reconcile } from 'solid-js/store'
import { instanceTs } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { fetchDevices, type Device } from '../resources/fetchDevices.js'

export const DevicesProvider = (props: ParentProps) => {
	const parameters = useParameters()
	const [devicesResource, { refetch: refetchDevices }] = createResource(
		parameters,
		fetchDevices(parameters.devicesAPIURL),
	)
	const [thingyWorldDevicesResource, { refetch: refetchThingyWorldDevices }] =
		createResource(parameters, fetchDevices(parameters.thingyWorldShadowsURL))

	// Use a store to only update the context when the devices change
	const [devicesStore, updateDevicesStore] = createStore<{ devices: Device[] }>(
		{
			devices: [],
		},
	)
	createEffect(() => {
		updateDevicesStore(
			'devices',
			reconcile(
				[
					...(devicesResource()?.devices ?? []),
					...(thingyWorldDevicesResource()?.devices ?? []),
				]
					.map(addLastUpdated)
					.sort(byLastUpdated),
			),
		)
	})

	// Refetch devices every minute
	const i = setInterval(() => {
		void refetchDevices()
		void refetchThingyWorldDevices()
	}, 1000 * 60)

	onCleanup(() => {
		clearInterval(i)
	})

	return (
		<DevicesContext.Provider value={() => devicesStore.devices}>
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
