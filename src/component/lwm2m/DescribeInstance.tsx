import {
	LwM2MObjectID,
	definitions,
	instanceTs,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { Show, createSignal } from 'solid-js'
import type { Device } from '../../resources/fetchDevices.js'
import { Published } from '../../icons/LucideIcon.js'
import { CollapseButton } from '../CollapseButton.js'
import { RelativeTime } from '../RelativeTime.js'
import { DescribeObject } from './DescribeObject.js'
import { DescribeResources } from './DescribeResources.js'

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
