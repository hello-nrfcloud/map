import {
	LwM2MObjectID,
	ResourceType,
	definitions,
	instanceTs,
	timestampResources,
	type LwM2MObjectInstance,
	type LwM2MResourceInfo,
	type LwM2MResourceValue,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { For, Show, createMemo, createSignal } from 'solid-js'
import type { Device } from '../context/Devices.jsx'
import { useNavigation, type Resource } from '../context/Navigation.jsx'
import { SearchTermType } from '../context/Search.js'
import {
	Close,
	Documentation,
	Favorite,
	Published,
	Search,
	Unfavorite,
} from '../icons/LucideIcon.jsx'
import { format } from '../util/lwm2m.js'
import { CollapseButton } from './CollapseButton.jsx'
import { CollapsibleMenu } from './CollapsibleMenu.jsx'
import { RelativeTime } from './RelativeTime.jsx'
import { ResourcesDL } from './ResourcesDL.jsx'
import { DescribeObject } from './lwm2m/DescribeObject.jsx'

export const DescribeInstance = (props: {
	instance: LwM2MObjectInstance
	device: Device
}) => {
	const [expanded, setExpanded] = createSignal<boolean>(false)
	const definition = definitions[props.instance.ObjectID as LwM2MObjectID]
	const ts = instanceTs(props.instance)
	return (
		<Show
			when={definition !== undefined}
			fallback={<p>Unknown Object ID: {props.instance.ObjectID}!</p>}
		>
			<div class="lwm2m">
				<section class="instance">
					<header class="rounded-header">
						<h2>
							<span>
								<span class="name">{definition.Name} </span>
							</span>
							<small>
								<RelativeTime time={ts}>
									<Published strokeWidth={1} size={16} />
								</RelativeTime>
							</small>
						</h2>
						<CollapseButton expanded={expanded} setExpanded={setExpanded} />
					</header>
					<Show when={expanded()}>
						<DescribeResources
							device={props.device}
							instance={props.instance}
						/>
					</Show>
				</section>
				<Show when={expanded()}>
					<DescribeObject instance={props.instance} />
				</Show>
			</div>
		</Show>
	)
}

export const DescribeResources = (props: {
	instance: LwM2MObjectInstance
	device: Device
}) => {
	const definition = definitions[props.instance.ObjectID as LwM2MObjectID]
	const tsResourceId = timestampResources[definition.ObjectID] as number

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
	const [showDefinition, setShowDefinition] = createSignal<boolean>(false)
	const location = useNavigation()
	const r: Resource = {
		model: props.device.model,
		ObjectID: props.ObjectID,
		ResourceID: props.info.ResourceID,
	}

	const v =
		props.value !== undefined ? format(props.value, props.info) : undefined

	return (
		<Show
			when={!showDefinition()}
			fallback={
				<DescribeResourceDefinition
					info={props.info}
					close={() => setShowDefinition(false)}
				/>
			}
		>
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
				<CollapsibleMenu>
					<nav>
						<Show when={!showDefinition()}>
							<button
								title="Show definition"
								type="button"
								onClick={() => setShowDefinition(true)}
							>
								<Documentation strokeWidth={1} size={20} />
							</button>
						</Show>
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
				</CollapsibleMenu>
			</dt>
			<dd class="value">
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
						<CollapsibleMenu>
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
						</CollapsibleMenu>
					</Show>
				</Show>
			</dd>
		</Show>
	)
}

const DescribeResourceDefinition = (props: {
	info: LwM2MResourceInfo
	close: () => void
}) => (
	<>
		<dt>
			<span class="info">
				<abbr class="name" title={props.info.Description}>
					<small>{props.info.ResourceID}:</small>
					{props.info.Name}
					<Show when={props.info.Units !== undefined}>
						<small>in {props.info.Units}</small>
					</Show>
					<small>({props.info.Type})</small>
				</abbr>
			</span>
			<nav>
				<button
					type="button"
					title="Close definition"
					onClick={() => props.close()}
				>
					<Close strokeWidth={1} size={20} />
				</button>
			</nav>
		</dt>
		<dd class="value">{props.info.Description}</dd>
	</>
)
