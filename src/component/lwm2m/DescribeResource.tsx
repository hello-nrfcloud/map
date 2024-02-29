import {
	LwM2MObjectID,
	ResourceType,
	type LwM2MResourceInfo,
	type LwM2MResourceValue,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { Show, createSignal } from 'solid-js'
import type { Device } from '../../context/Devices.js'
import { useNavigation, type Resource } from '../../context/Navigation.js'
import { SearchTermType } from '../../context/Search.js'
import {
	Documentation,
	Favorite,
	Published,
	Search,
	Unfavorite,
} from '../../icons/LucideIcon.js'
import { format } from '../../util/lwm2m.js'
import { CollapsibleMenu } from '../CollapsibleMenu.js'
import { RelativeTime } from '../RelativeTime.js'
import { DescribeResourceDefinition } from './DescribeResourceDefinition.js'

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
