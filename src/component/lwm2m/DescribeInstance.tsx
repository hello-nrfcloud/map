import {
	LwM2MObjectID,
	definitions,
	instanceTs,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { Show } from 'solid-js'
import { Published } from '../../icons/LucideIcon.js'
import type { Device } from '../../resources/fetchDevices.js'
import { CollapseButton } from '../CollapseButton.js'
import { RelativeTime } from '../RelativeTime.js'
import { WhenToggled } from '../WhenToggled.jsx'
import { DescribeObject } from './DescribeObject.js'
import { DescribeResources } from './DescribeResources.js'

export const DescribeInstance = (props: {
	instance: LwM2MObjectInstance
	device: Device
}) => {
	const definition = definitions[props.instance.ObjectID as LwM2MObjectID]
	const ts = instanceTs(props.instance)
	const toggleId = `di;${props.instance.ObjectID}`
	return (
		<Show
			when={definition !== undefined}
			fallback={<p>Unknown Object ID: {props.instance.ObjectID}!</p>}
		>
			<section class="lwm2m instance">
				<div>
					<header class="pad">
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
						<CollapseButton id={toggleId} />
					</header>
					<WhenToggled id={toggleId}>
						<DescribeResources
							device={props.device}
							instance={props.instance}
						/>
					</WhenToggled>
				</div>
				<WhenToggled id={toggleId}>
					<DescribeObject instance={props.instance} />
				</WhenToggled>
			</section>
		</Show>
	)
}
