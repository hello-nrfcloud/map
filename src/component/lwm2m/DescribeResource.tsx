import {
	LwM2MObjectID,
	ResourceType,
	type LwM2MResourceInfo,
	type LwM2MResourceValue,
	ModelID,
} from '@hello.nrfcloud.com/proto-map'
import { Show, createSignal } from 'solid-js'
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
	ts?: Date | undefined
	device: Device
}) => {
	const [showDefinition, setShowDefinition] = createSignal<boolean>(false)
	const [showHistory, setShowHistory] = createSignal<boolean>(false)
	const location = useNavigation()
	const r: PinnedResource = {
		model: props.device.model as ModelID,
		ObjectID: props.ObjectID,
		ResourceID: props.info.ResourceID,
	}

	const v =
		props.value !== undefined ? format(props.value, props.info) : undefined

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
										title="Pin to map"
										type="button"
										onClick={() => location.toggleResource(r)}
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
								isSearchable(props.info, props.value) || hasHistory(props.info)
							}
						>
							<CollapsibleMenu>
								<nav>
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
											title={`Graph the history of the ${props.info.Name} resource.`}
											class="button"
											onClick={() => setShowHistory((s) => !s)}
										>
											<History strokeWidth={1} size={20} />
										</button>
									</Show>
								</nav>
							</CollapsibleMenu>
						</Show>
					</Show>
				</dd>
			</Show>
			<Show when={showHistory()}>
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
