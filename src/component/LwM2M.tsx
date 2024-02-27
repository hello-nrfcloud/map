import { For, Show, createSignal } from 'solid-js'
import {
	type LwM2MObjectInstance,
	definitions,
	LwM2MObjectID,
	timestampResources,
	type LwM2MResourceValue,
	type LwM2MResourceInfo,
	ResourceType,
} from '@hello.nrfcloud.com/proto-lwm2m'
import {
	Collapse,
	Documentation,
	Expand,
	Multiple,
	Search,
	Favorite,
	Unfavorite,
} from '../icons/LucideIcon.jsx'
import { instanceTs } from '../util/instanceTs.js'
import { RelativeTime } from './RelativeTime.jsx'
import { ResourcesDL } from './ResourcesDL.jsx'
import { SourceInfo } from './SourceInfo.jsx'
import { SearchTermType } from '../context/Search.js'
import { useNavigation, type Resource } from '../context/Navigation.jsx'
import { format } from '../util/lwm2m.js'
import type { Device } from '../context/Devices.jsx'

export const DescribeInstance = (props: {
	instance: LwM2MObjectInstance
	device: Device
}) => {
	const [expanded, setExpanded] = createSignal<boolean>(false)
	const definition = definitions[props.instance.ObjectID as LwM2MObjectID]
	const ts = instanceTs(props.instance)
	const instanceId = props.instance.ObjectInstanceID ?? 0
	return (
		<Show
			when={definition !== undefined}
			fallback={<p>Unknown Object ID: {props.instance.ObjectID}!</p>}
		>
			<section class="lwm2m instance">
				<header>
					<h2>
						<span>
							{definition.Name}{' '}
							<small>
								({props.instance.ObjectID})
								<Show when={instanceId !== 0}>
									<abbr
										title={`Instance ID: ${instanceId}`}
										class="multiple-instances"
									>
										<Multiple strokeWidth={1} size={16} /> {instanceId}
									</abbr>
								</Show>
							</small>
						</span>
						<small>
							<RelativeTime time={ts} />
						</small>
					</h2>
					<Show
						when={expanded()}
						fallback={
							<button type="button" onClick={() => setExpanded(true)}>
								<Expand strokeWidth={1} />
							</button>
						}
					>
						<button type="button" onClick={() => setExpanded(false)}>
							<Collapse strokeWidth={1} />
						</button>
					</Show>
				</header>
				<Show when={expanded()}>
					<DescribeResources device={props.device} instance={props.instance} />
				</Show>
			</section>
		</Show>
	)
}

export const DescribeResources = (props: {
	instance: LwM2MObjectInstance
	device: Device
}) => {
	const definition = definitions[props.instance.ObjectID as LwM2MObjectID]
	const tsResourceId = timestampResources[definition.ObjectID] as number
	const location = useNavigation()
	return (
		<div class="instance-resources">
			<ResourcesDL>
				<For
					each={Object.entries(props.instance.Resources).filter(
						([resourceId]) => parseInt(resourceId, 10) !== tsResourceId,
					)}
				>
					{([resourceID, value]) => (
						<DescribeResource
							device={props.device}
							instance={props.instance}
							info={
								definition.Resources[
									parseInt(resourceID, 10)
								] as LwM2MResourceInfo
							}
							value={value}
						/>
					)}
				</For>
			</ResourcesDL>
			<SourceInfo>
				<p>
					<Documentation size={16} strokeWidth={1} />
					<a
						href={`https://github.com/hello-nrfcloud/proto-lwm2m/blob/saga/lwm2m/${props.instance.ObjectID}.xml`}
						target="_blank"
					>
						LwM2M Object ID: <code>{props.instance.ObjectID}</code>, Version:{' '}
						<code>{props.instance.ObjectVersion ?? '1.0'}</code>
					</a>
				</p>
				<p>
					<Search size={16} strokeWidth={1} />
					<a
						href={location.linkToSearch({
							type: SearchTermType.Has,
							term: props.instance.ObjectID.toString(),
						})}
					>
						Search for all devices with ObjectID{' '}
						<code>{props.instance.ObjectID}</code>
					</a>
				</p>
			</SourceInfo>
		</div>
	)
}

export const DescribeResource = (props: {
	instance: LwM2MObjectInstance
	info: LwM2MResourceInfo
	value: LwM2MResourceValue
	device: Device
}) => {
	const location = useNavigation()
	const r: Resource = {
		model: props.device.model,
		ObjectID: props.instance.ObjectID,
		ResourceID: props.info.ResourceID,
	}

	const { value, units } = format(props.value, props.info)

	return (
		<>
			<dt>
				<abbr class="name" title={props.info.Description}>
					{props.info.Name}
				</abbr>
				<span>
					<span class="resource-info">
						<small class="object-id">{props.instance.ObjectID}</small>
						<small class="sep">/</small>
						<small class="resource-id">{props.info.ResourceID}</small>
					</span>
					<nav>
						<Show
							when={location.hasResource(r)}
							fallback={
								<button
									title="Add to favorites"
									type="button"
									onClick={() => location.toggleResource(r)}
								>
									<Favorite strokeWidth={1} size={16} />
								</button>
							}
						>
							<button
								title="Remove from favorites"
								type="button"
								onClick={() => location.toggleResource(r)}
							>
								<Unfavorite strokeWidth={1} size={16} />
							</button>
						</Show>
						<a
							href={location.link({
								panel: 'search',
								search: [
									{
										type: SearchTermType.Has,
										term: `${props.instance.ObjectID}/${props.info.ResourceID}`,
									},
								],
							})}
							title={`Search for devices that have the object ${props.instance.ObjectID} and the resource ${props.info.ResourceID}`}
						>
							<Search strokeWidth={1} size={16} />
						</a>
					</nav>
				</span>
			</dt>
			<dd>
				<span>
					<span class="value">{value}</span>
					<Show when={units !== undefined}>
						<span class="units">{units}</span>
					</Show>
				</span>
				<Show
					when={
						props.info.Type === ResourceType.String &&
						typeof props.value === 'string' &&
						!/^[0-9]+$/.test(props.value)
					}
				>
					<nav>
						<a
							href={location.link({
								panel: 'search',
								search: [
									{
										type: SearchTermType.Has,
										term: `${props.instance.ObjectID}/${props.info.ResourceID}=${props.value.toString()}`,
									},
								],
							})}
							title={`Search for devices that have the object ${props.instance.ObjectID} and the resource ${props.info.ResourceID} with the value ${props.value.toString()}`}
						>
							<small>
								<Search strokeWidth={1} size={16} />
							</small>
						</a>
					</nav>
				</Show>
			</dd>
		</>
	)
}
