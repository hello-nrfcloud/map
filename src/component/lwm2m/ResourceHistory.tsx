import {
	definitions,
	timestampResources,
	type LwM2MObjectID,
	type LwM2MObjectInstance,
	type LwM2MResourceInfo,
	ResourceType,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { Show, createMemo, createResource } from 'solid-js'
import type { Device } from '../../context/Devices.js'
import { useParameters } from '../../context/Parameters.js'
import { SizeObserver } from '../SizeObserver.jsx'
import { HistoryChart } from '../chart/HistoryChart.jsx'

import './ResourceHistory.css'

const fetchHistory =
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
		'@context': 'https://github.com/hello-nrfcloud/proto/map/history'
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
			`/?${new URLSearchParams({
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

const tsResource = (ObjectID: LwM2MObjectID): number => {
	const definition = definitions[ObjectID]
	return timestampResources[definition.ObjectID] as number // All registered objects must have a timestamp resource
}

export const ResourceHistory = (props: {
	device: Device
	resource: LwM2MResourceInfo
	ObjectID: LwM2MObjectID
	InstanceID: number
}) => {
	const parameters = useParameters()
	const [history] = createResource(
		parameters,
		fetchHistory(parameters.lwm2mResourceHistoryURL, props),
	)

	const resourceHistory = createMemo(() => {
		const ts = tsResource(props.ObjectID)
		return (history()?.partialInstances ?? [])
			.filter((partial) => partial[props.resource.ResourceID] !== undefined)
			.map<
				[number, Date]
			>((partial) => [partial[props.resource.ResourceID] as number, new Date(partial[ts] as number)])
	})

	return (
		<aside class="resource-history">
			<header>
				<h3>History</h3>
			</header>
			<Show when={!history.loading} fallback={<p>Loading history...</p>}>
				<Show
					when={resourceHistory().length > 0}
					fallback={<p>No historical data available.</p>}
				>
					<SizeObserver class="chart-container">
						{(size) => {
							const min = Math.floor(
								resourceHistory().reduce(
									(min, [v]) => (v < min ? v : min),
									Number.MAX_SAFE_INTEGER,
								),
							)
							const max = Math.ceil(
								resourceHistory().reduce(
									(max, [v]) => (v > max ? v : max),
									Number.MIN_SAFE_INTEGER,
								),
							)
							return (
								<HistoryChart
									data={{
										xAxis: {
											color: '#ffffff',
											hideLabels: false,
											labelEvery: 2 * 60,
											minutes: 60 * 24,
											format: (d) => d.toISOString().slice(11, 13),
										},
										datasets: [
											{
												min: min === max ? Math.floor(min * 0.99) : min,
												max: max === min ? Math.ceil(max * 1.01) : max,
												values: resourceHistory().map(([v, ts]) => [v, ts]),
												color: '#ffffff',
												format: (v) => {
													if (props.resource.Type === ResourceType.Float)
														return v.toFixed(1).replace(/\.0$/, '')
													return v.toString()
												},
											},
										],
									}}
									size={size}
								/>
							)
						}}
					</SizeObserver>
				</Show>
			</Show>
		</aside>
	)
}
