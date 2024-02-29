import {
	definitions,
	instanceTs,
	timestampResources,
	type LwM2MObjectID,
	type LwM2MObjectInstance,
	type LwM2MResourceInfo,
} from '@hello.nrfcloud.com/proto-lwm2m'
import type { Device } from '../../context/Devices.js'
import { createResource, For, Show } from 'solid-js'
import { useParameters } from '../../context/Parameters.js'
import { RelativeTime } from '../RelativeTime.jsx'
import { ResourcesDL } from '../ResourcesDL.jsx'

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

	return (
		<Show
			when={!history.loading}
			fallback={<p class="pad">Loading history...</p>}
		>
			<header class="pad">
				<h3>History</h3>
			</header>
			<ResourcesDL>
				<For each={history()?.partialInstances}>
					{(r) => {
						const ts = instanceTs({
							ObjectID: props.ObjectID,
							Resources: r,
							ObjectInstanceID: props.InstanceID,
							ObjectVersion: history()!.query.ObjectVersion,
						})
						const {
							ts: persistTs,
							[tsResource(props.ObjectID)]: tsResourceValue,
							...rest
						} = r
						void persistTs
						void tsResourceValue
						return (
							<>
								<For each={Object.entries(rest)}>
									{([ResourceID, Value]) => (
										<>
											<dt>{ResourceID}</dt>
											<dd>{Value.toString() ?? '&mdash;'}</dd>
										</>
									)}
								</For>
								<dt>Timestamp</dt>
								<dd>
									<RelativeTime time={ts} />
								</dd>
							</>
						)
					}}
				</For>
			</ResourcesDL>
		</Show>
	)
}
