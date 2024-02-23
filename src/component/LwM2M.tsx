import { For, Show, createSignal } from 'solid-js'
import {
	type LwM2MObjectInstance,
	definitions,
	LwM2MObjectID,
	timestampResources,
	type LwM2MResourceValue,
	type LwM2MResourceInfo,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { formatDistanceToNow } from 'date-fns'
import {
	Collapse,
	Documentation,
	Expand,
	Multiple,
	Updated,
	ExternalLink,
} from './LucideIcon.js'
import { instanceTs } from '../util/instanceTs.js'

export const DescribeInstance = ({
	instance,
}: {
	instance: LwM2MObjectInstance
}) => {
	const [expanded, setExpanded] = createSignal<boolean>(false)
	const definition = definitions[instance.ObjectID as LwM2MObjectID]
	const tsResourceId = timestampResources[definition.ObjectID] as number
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
							<time dateTime={ts.toISOString()}>
								<Updated size={12} strokeWidth={1} />
								{formatDistanceToNow(ts, { addSuffix: true })}
							</time>
						</small>
					</h2>

					<Show
						when={expanded()}
						fallback={
							<button type="button" onClick={() => setExpanded(true)}>
								<Expand />
							</button>
						}
					>
						<button type="button" onClick={() => setExpanded(false)}>
							<Collapse />
						</button>
					</Show>
				</header>
				<Show when={expanded()}>
					<div class="resources">
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
					</div>
				</Show>
			</section>
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
				{value.toString()}
				<Show when={info.Units !== undefined}>{` ${info.Units}`}</Show>
			</dd>
		</>
	)
}
