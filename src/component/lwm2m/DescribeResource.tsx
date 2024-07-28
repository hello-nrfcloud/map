import type { LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import {
	ResourceType,
	type LwM2MResourceInfo,
	type LwM2MResourceValue,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import { Show, createSignal, For } from 'solid-js'
import type { Device } from '../../resources/fetchDevices.js'
import { useNavigation } from '../../context/Navigation.js'
import { SearchTermType } from '../../search.ts'
import {
	Documentation,
	History,
	Published,
	Search,
	PinOnMap,
	UnpinFromMap,
} from '../../icons/LucideIcon.js'
import { format } from '../../util/lwm2m.js'
import { CollapsibleMenu } from '../CollapsibleMenu.js'
import { RelativeTime } from '../RelativeTime.js'
import { DescribeResourceDefinition } from './DescribeResourceDefinition.js'
import { ResourceHistory } from './ResourceHistory.js'
import type { PinnedResource } from '../../context/navigation/encodeNavigation.ts'

export const DescribeResource = (props: {
	ObjectID: LwM2MObjectID
	InstanceID: number
	info: LwM2MResourceInfo
	value: LwM2MResourceValue | undefined
	// Timestamp when the instance was last updated
	ts?: number | undefined
	device: Device
}) => {
	const [showDefinition, setShowDefinition] = createSignal<boolean>(false)
	const location = useNavigation()
	const r: PinnedResource = {
		model: props.device.model as ModelID,
		ObjectID: props.ObjectID,
		ResourceID: props.info.ResourceID,
	}

	const v =
		props.value !== undefined ? format(props.value, props.info) : undefined

	const chartId = () =>
		`chart;${props.ObjectID}/${props.InstanceID}/${props.info.ResourceID}`

	return (
		<>
			<Show
				when={!showDefinition()}
				fallback={
					<DescribeResourceDefinition
						info={props.info}
						ObjectID={props.ObjectID}
						close={() => setShowDefinition(false)}
					/>
				}
			>
				<dt title={`Resource ${props.info.ResourceID}`}>
					<span class="info">
						<abbr class="name" title={props.info.Description}>
							{props.info.Name}
						</abbr>
						<Show when={props.ts !== undefined}>
							<RelativeTime time={new Date(props.ts! * 1000)}>
								<Published strokeWidth={1} size={16} />
							</RelativeTime>
						</Show>
					</span>
					<CollapsibleMenu
						id={`${props.ObjectID}/${props.info.ResourceID}/info`}
					>
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
									title="Pin to map"
									type="button"
									onClick={() => location.toggleResource(r)}
									class="pin-to-map"
								>
									<PinOnMap strokeWidth={1} size={20} />
								</button>
							}
						>
							<button
								title="Unpin from map"
								type="button"
								onClick={() => location.toggleResource(r)}
							>
								<UnpinFromMap strokeWidth={1} size={20} />
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
					</CollapsibleMenu>
				</dt>
				<dd
					class={`value ${props.info.Multiple ? 'multiple' : ''}`}
					title={`Value of resource ${props.info.ResourceID}`}
				>
					<DescribeValue value={props.value} info={props.info} />
					<Show
						when={
							isSearchable(props.info, props.value) || hasHistory(props.info)
						}
					>
						<CollapsibleMenu
							id={`${props.ObjectID}/${props.info.ResourceID}/value`}
						>
							<Show when={isSearchable(props.info, props.value)}>
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
									title={`Search for devices that have the object ${props.ObjectID} and the resource ${props.info.ResourceID} with the value ${v!.value.toString()}.`}
								>
									<Search strokeWidth={1} size={20} />
								</a>
							</Show>
							<Show when={hasHistory(props.info)}>
								<button
									type="button"
									title={`Graph the history of the ${props.info.Name} resource`}
									class="button"
									onClick={() => location.toggle(chartId())}
								>
									<History strokeWidth={1} size={20} />
								</button>
							</Show>
						</CollapsibleMenu>
					</Show>
				</dd>
			</Show>
			<Show when={location.isToggled(chartId())}>
				<ResourceHistory
					device={props.device}
					ObjectID={props.ObjectID}
					resource={props.info}
					InstanceID={props.InstanceID}
				/>
			</Show>
		</>
	)
}

const isSearchable = (info: LwM2MResourceInfo, value?: LwM2MResourceValue) =>
	info.Type === ResourceType.String &&
	typeof value === 'string' &&
	!/^[0-9]+$/.test(value)

const hasHistory = (info: LwM2MResourceInfo) =>
	info.Type === ResourceType.Integer || info.Type === ResourceType.Float

const DescribeValue = (props: {
	info: LwM2MResourceInfo
	value: LwM2MResourceValue | undefined
}) => (
	<Show when={props.value !== undefined} fallback={<span>&mdash;</span>}>
		<Show
			when={props.info.Multiple && Array.isArray(props.value)}
			fallback={
				<DescribeScalarValue
					info={props.info}
					value={props.value as string | number | boolean}
				/>
			}
		>
			<For each={props.value as Array<string | number | boolean>}>
				{(value) => <DescribeScalarValue info={props.info} value={value} />}
			</For>
		</Show>
	</Show>
)

const DescribeScalarValue = (props: {
	value: string | number | boolean
	info: LwM2MResourceInfo
}) => {
	const v =
		props.value !== undefined ? format(props.value, props.info) : undefined
	return (
		<span class="resource-value">
			<span class="value">{v!.value}</span>
			<Show when={v!.units !== undefined}>
				<span class="units">{v!.units}</span>
			</Show>
		</span>
	)
}
