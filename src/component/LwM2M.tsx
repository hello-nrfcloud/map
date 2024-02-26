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
import { linkToPanel } from '../util/link.js'
import { SourceInfo } from './SourceInfo.jsx'

export const DescribeInstance = ({
	instance,
}: {
	instance: LwM2MObjectInstance
}) => {
	const [expanded, setExpanded] = createSignal<boolean>(false)
	const definition = definitions[instance.ObjectID as LwM2MObjectID]
	const ts = instanceTs(instance)
	const instanceId = instance.ObjectInstanceID ?? 0
	return (
		<Show
			when={definition !== undefined}
			fallback={<p>Unknown Object ID: {instance.ObjectID}!</p>}
		>
			<section class="lwm2m instance">
				<header>
					<h2>
						<span>
							{definition.Name}{' '}
							<small>
								({instance.ObjectID})
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
					<DescribeResources instance={instance} />
				</Show>
			</section>
		</Show>
	)
}

export const DescribeResources = ({
	instance,
}: {
	instance: LwM2MObjectInstance
}) => {
	const definition = definitions[instance.ObjectID as LwM2MObjectID]
	const tsResourceId = timestampResources[definition.ObjectID] as number
	return (
		<div class="instance-resources">
			<ResourcesDL>
				<For
					each={Object.entries(instance.Resources).filter(
						([resourceId]) => parseInt(resourceId, 10) !== tsResourceId,
					)}
				>
					{([resourceID, value]) => (
						<DescribeResource
							instance={instance}
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
						href={`https://github.com/hello-nrfcloud/proto-lwm2m/blob/saga/lwm2m/${instance.ObjectID}.xml`}
						target="_blank"
					>
						LwM2M Object ID: <code>{instance.ObjectID}</code>, Version:{' '}
						<code>{instance.ObjectVersion ?? '1.0'}</code>
					</a>
				</p>
				<p>
					<Search size={16} strokeWidth={1} />
					<a
						href={linkToPanel(
							`search`,
							new URLSearchParams({ has: instance.ObjectID.toString() }),
						)}
					>
						Search for all devices with ObjectID{' '}
						<code>{instance.ObjectID}</code>
					</a>
				</p>
			</SourceInfo>
		</div>
	)
}

const DescribeResource = ({
	instance,
	info,
	value,
}: {
	instance: LwM2MObjectInstance
	info: LwM2MResourceInfo
	value: LwM2MResourceValue
}) => {
	return (
		<>
			<dt>
				<small>{info.ResourceID}: </small>
				<abbr title={info.Description}>{info.Name}</abbr>{' '}
				<a
					href={linkToPanel(
						'search',
						new URLSearchParams({
							has: `${instance.ObjectID}/${info.ResourceID}`,
						}),
					)}
					title={`Search for devices that have the object ${instance.ObjectID} and the resource ${info.ResourceID}`}
				>
					<small>
						<Search strokeWidth={1} size={14} />
					</small>
				</a>
			</dt>
			<dd>
				<Show when={info.Type === ResourceType.String}>
					<a
						href={linkToPanel(
							'search',
							new URLSearchParams({
								has: `${instance.ObjectID}/${info.ResourceID}=${value.toString()}`,
							}),
						)}
						title={`Search for devices that have the object ${instance.ObjectID} and the resource ${info.ResourceID} with the value ${value.toString()}`}
					>
						<small>
							<Search strokeWidth={1} size={14} />
						</small>
					</a>{' '}
				</Show>
				<DescribeValue info={info} value={value} />
				<Show when={info.Units !== undefined}>{` ${info.Units}`}</Show>
			</dd>
		</>
	)
}

const DescribeValue = ({
	value,
	info,
}: {
	value: LwM2MResourceValue
	info: LwM2MResourceInfo
}) => {
	if (info.Type === ResourceType.Float && typeof value === 'number')
		return value.toFixed(2).replace(/\.00$/, '')
	return value.toString()
}
