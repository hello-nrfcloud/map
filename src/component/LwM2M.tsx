import { For, Show, createSignal } from 'solid-js'
import {
	type LwM2MObjectInstance,
	definitions,
	LwM2MObjectID,
	timestampResources,
	type LwM2MResourceValue,
	type LwM2MResourceInfo,
} from '@hello.nrfcloud.com/proto-lwm2m'
import {
	Collapse,
	Documentation,
	Expand,
	Multiple,
	ExternalLink,
	Search,
} from '../icons/LucideIcon.jsx'
import { instanceTs } from '../util/instanceTs.js'
import { RelativeTime } from './RelativeTime.jsx'
import { ResourcesDL } from './ResourcesDL.jsx'
import { linkToPanel } from '../util/link.js'

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
							<Collapse />
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
			<p class="source">
				<Documentation size={16} strokeWidth={1} />
				<a
					href={`https://github.com/hello-nrfcloud/proto-lwm2m/blob/saga/lwm2m/${instance.ObjectID}.xml`}
					target="_blank"
				>
					<span>
						LwM2M Object ID: {instance.ObjectID}, Version:{' '}
						{instance.ObjectVersion ?? '1.0'}
					</span>
					<ExternalLink size={16} strokeWidth={1} />
				</a>
			</p>
			<p class="source">
				<Search size={16} strokeWidth={1} />
				<a
					href={linkToPanel(
						`search`,
						new URLSearchParams({ object: instance.ObjectID.toString() }),
					)}
				>
					Search for all devices with ObjectID {instance.ObjectID}
				</a>
			</p>
		</div>
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
				{value.toString()}
				<Show when={info.Units !== undefined}>{` ${info.Units}`}</Show>
			</dd>
		</>
	)
}
