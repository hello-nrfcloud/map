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
} from '../icons/LucideIcon.jsx'
import { instanceTs } from '../util/instanceTs.js'
import { RelativeTime } from './RelativeTime.jsx'
import { ResourcesDL } from './ResourcesDL.jsx'
import { SourceInfo } from './SourceInfo.jsx'
import { SearchTermType } from '../context/Search.js'
import { useNavigation } from '../context/Navigation.jsx'

export const DescribeInstance = (props: { instance: LwM2MObjectInstance }) => {
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
										<Multiple strokeWidth={1} size={14} /> {instanceId}
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
					<DescribeResources instance={props.instance} />
				</Show>
			</section>
		</Show>
	)
}

export const DescribeResources = (props: { instance: LwM2MObjectInstance }) => {
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

const DescribeResource = (props: {
	instance: LwM2MObjectInstance
	info: LwM2MResourceInfo
	value: LwM2MResourceValue
}) => {
	const location = useNavigation()
	return (
		<>
			<dt>
				<span>
					<small>{props.info.ResourceID}: </small>
					<abbr title={props.info.Description}>{props.info.Name}</abbr>
				</span>
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
					<small>
						<Search strokeWidth={1} size={14} />
					</small>
				</a>
			</dt>
			<dd>
				<span>
					<DescribeValue info={props.info} value={props.value} />
					<Show
						when={props.info.Units !== undefined}
					>{` ${props.info.Units}`}</Show>
				</span>
				<Show
					when={
						props.info.Type === ResourceType.String &&
						typeof props.value === 'string' &&
						!/^[0-9]+$/.test(props.value)
					}
				>
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
							<Search strokeWidth={1} size={14} />
						</small>
					</a>{' '}
				</Show>
			</dd>
		</>
	)
}

const DescribeValue = (props: {
	value: LwM2MResourceValue
	info: LwM2MResourceInfo
}) => {
	if (props.info.Type === ResourceType.Float && typeof props.value === 'number')
		return props.value.toFixed(2).replace(/\.00$/, '')
	return props.value.toString()
}
