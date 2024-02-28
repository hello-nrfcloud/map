import { For, Show, createSignal, createMemo } from 'solid-js'
import {
	type LwM2MObjectInstance,
	definitions,
	LwM2MObjectID,
	timestampResources,
	type LwM2MResourceValue,
	type LwM2MResourceInfo,
	ResourceType,
	instanceTs,
} from '@hello.nrfcloud.com/proto-lwm2m'
import {
	Collapse,
	Documentation,
	Expand,
	Multiple,
	Search,
	Favorite,
	Unfavorite,
	Published,
} from '../icons/LucideIcon.jsx'
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
							<span class="name">{definition.Name} </span>
							<small>
								({props.instance.ObjectID})
								<Show when={instanceId !== 0}>
									<abbr
										title={`Instance ID: ${instanceId}`}
										class="multiple-instances"
									>
										<Multiple strokeWidth={1} size={20} /> {instanceId}
									</abbr>
								</Show>
							</small>
						</span>
						<small>
							<RelativeTime time={ts}>
								<Published strokeWidth={1} size={16} />
							</RelativeTime>
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

	const resources = createMemo(() => {
		const r: { info: LwM2MResourceInfo; value: LwM2MResourceValue }[] = []
		for (const [resourceID, value] of Object.entries(
			props.instance.Resources,
		).filter(([resourceId]) => parseInt(resourceId, 10) !== tsResourceId)) {
			const ResourceID = parseInt(resourceID, 10)
			const info = definition.Resources[ResourceID]
			if (info === undefined) {
				console.warn(
					`[DescribeResources]`,
					`Unknown resource on device ${props.device.id}: ${props.instance.ObjectID}:${ResourceID}`,
				)
				continue
			}
			r.push({ info, value })
		}
		return r
	})

	return (
		<div class="instance-resources">
			<ResourcesDL>
				<For each={resources()}>
					{({ info, value }) => (
						<DescribeResource
							device={props.device}
							ObjectID={props.instance.ObjectID}
							info={info}
							value={value}
						/>
					)}
				</For>
			</ResourcesDL>
			<SourceInfo>
				<p>
					<Documentation size={20} strokeWidth={1} />
					<a
						href={`https://github.com/hello-nrfcloud/proto-lwm2m/blob/saga/lwm2m/${props.instance.ObjectID}.xml`}
						target="_blank"
					>
						LwM2M Object ID: <code>{props.instance.ObjectID}</code>, Version:{' '}
						<code>{props.instance.ObjectVersion ?? '1.0'}</code>
					</a>
				</p>
				<p>
					<Search size={20} strokeWidth={1} />
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
	ObjectID: LwM2MObjectID
	info: LwM2MResourceInfo
	value: LwM2MResourceValue | undefined
	// Timestamp when the instance was last updated
	ts?: Date | undefined
	device: Device
}) => {
	const location = useNavigation()
	const r: Resource = {
		model: props.device.model,
		ObjectID: props.ObjectID,
		ResourceID: props.info.ResourceID,
	}

	const v =
		props.value !== undefined ? format(props.value, props.info) : undefined

	return (
		<>
			<dt>
				<span class="info">
					<abbr class="name" title={props.info.Description}>
						{props.info.Name}
					</abbr>
					<Show when={props.ts !== undefined}>
						<RelativeTime time={props.ts!}>
							<Published strokeWidth={1} size={16} />
						</RelativeTime>
					</Show>
				</span>
				<span class="meta">
					<span class="resource-info">
						<small class="object-id">{props.ObjectID}</small>
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
									<Favorite strokeWidth={1} size={20} />
								</button>
							}
						>
							<button
								title="Remove from favorites"
								type="button"
								onClick={() => location.toggleResource(r)}
							>
								<Unfavorite strokeWidth={1} size={20} />
							</button>
						</Show>
						<a
							href={location.link({
								panel: 'search',
								search: [
									{
										type: SearchTermType.Has,
										term: `${props.ObjectID}/${props.info.ResourceID}`,
									},
								],
							})}
							title={`Search for devices that have the object ${props.ObjectID} and the resource ${props.info.ResourceID}`}
						>
							<Search strokeWidth={1} size={20} />
						</a>
					</nav>
				</span>
			</dt>
			<dd>
				<Show when={v !== undefined} fallback={<span>&mdash;</span>}>
					<span class="resource-value">
						<span class="value">{v!.value}</span>
						<Show when={v!.units !== undefined}>
							<span class="units">{v!.units}</span>
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
											term: `${props.ObjectID}/${props.info.ResourceID}=${v!.value.toString()}`,
										},
									],
								})}
								title={`Search for devices that have the object ${props.ObjectID} and the resource ${props.info.ResourceID} with the value ${v!.value.toString()}`}
							>
								<small>
									<Search strokeWidth={1} size={20} />
								</small>
							</a>
						</nav>
					</Show>
				</Show>
			</dd>
		</>
	)
}
