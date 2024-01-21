import type { PublicDevice } from '@hello.nrfcloud.com/proto/hello/map'
import { useDevices } from '../context/Devices'
import { For, Show } from 'solid-js'
import { type Static } from '@sinclair/typebox'
import {
	type LwM2MObjectInstance,
	definitions,
	LwM2MObjectID,
	timestampResources,
	type LwM2MResourceValue,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { formatDistanceToNow } from 'date-fns'
export const Devices = () => {
	const devices = useDevices()

	return (
		<section>
			<h1>Devices</h1>
			<For each={devices()}>{(device) => <Device device={device} />}</For>
		</section>
	)
}

const Device = ({ device }: { device: Static<typeof PublicDevice> }) => (
	<div>
		<h2>{device.id}</h2>
		<p>Model: {device.model}</p>
		<Show
			when={device.state !== undefined}
			fallback={<p>No state available.</p>}
		>
			<DeviceState state={device.state as State} />
		</Show>
	</div>
)

type State = Static<(typeof PublicDevice)['state']>

const DeviceState = ({ state }: { state: State }) => (
	<ul>
		<For each={state}>
			{(instance) => <DescribeInstance instance={instance} />}
		</For>
	</ul>
)

const DescribeInstance = ({ instance }: { instance: LwM2MObjectInstance }) => {
	const definition = definitions[instance.ObjectID as LwM2MObjectID]
	const tsResourceId = timestampResources[definition.ObjectID] as number
	const ts = instance.Resources[tsResourceId] as string
	console.log(ts)
	return (
		<Show
			when={definition !== undefined}
			fallback={<p>Unknown Object ID: {instance.ObjectID}!</p>}
		>
			<dl>
				<dt>Object</dt>
				<dd>
					{definition.Name} ({instance.ObjectID})
				</dd>
				<dt>Version</dt>
				<dd>{instance.ObjectVersion ?? '1.0'}</dd>
				<dt>Instance ID</dt>
				<dd>{instance.ObjectInstanceID ?? 0}</dd>
				<dt>Updated</dt>
				<dd>
					<time dateTime={ts}>
						{formatDistanceToNow(ts, { addSuffix: true })}
					</time>
				</dd>
				<dt>Resources</dt>
				<dt>
					<dl>
						<For
							each={Object.entries(instance.Resources).filter(
								([resourceId]) => parseInt(resourceId, 10) !== tsResourceId,
							)}
						>
							{([resourceID, value]) => (
								<DescribeResource
									info={
										definition.Resources[
											parseInt(resourceID, 10)
										] as LwM2MResourceInfo
									}
									value={value}
								/>
							)}
						</For>
					</dl>
				</dt>
			</dl>
		</Show>
	)
}

const DescribeResource = ({
	info,
	value,
}: {
	info: LwM2MResourceInfo
	value: LwM2MResourceValue
}) => {
	return (
		<>
			<dt>
				<abbr title={info.Description}>{info.Name}</abbr>
			</dt>
			<dd>
				{`${value}`}
				<Show when={info.Units !== undefined}>{` ${info.Units}`}</Show>
			</dd>
		</>
	)
}

// FIXME: use from proto-lwm2m
type LwM2MResourceInfo = {
	ResourceID: number
	Name: string
	Mandatory: boolean
	Type: ResourceType
	Description: string // e.g. 'The decimal notation of latitude, e.g. -43.5723 [World Geodetic System 1984].'
	RangeEnumeration?: string // e.g. ''
	Units?: string // e.g. 'lat'
}
// FIXME: use from proto-lwm2m
enum ResourceType {
	String = 'String',
	Integer = 'Integer',
	Float = 'Float',
	Boolean = 'Boolean',
	Opaque = 'Opaque',
	Time = 'Time',
}
