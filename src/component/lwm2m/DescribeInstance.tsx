import {
	LwM2MObjectID,
	definitions,
	instanceTs,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { Show } from 'solid-js'
import { Multiple, Published } from '../../icons/LucideIcon.js'
import type { Device } from '../../resources/fetchDevices.js'
import { ToggleButton } from '../ToggleButton.jsx'
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
	const toggleId = `di;${props.instance.ObjectID};${props.instance.ObjectInstanceID ?? 0}`
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
								<span class="name">{definition.Name}</span>
								<Show when={(props.instance.ObjectInstanceID ?? 0) !== 0}>
									<small>
										<abbr
											title={`Instance ID: ${props.instance.ObjectInstanceID}`}
											class="multiple-instances"
										>
											<Multiple strokeWidth={1} size={16} />
											{props.instance.ObjectInstanceID}
										</abbr>
									</small>
								</Show>
							</span>
							<small>
								<RelativeTime time={ts}>
									<Published strokeWidth={1} size={16} />
								</RelativeTime>
							</small>
						</h2>
						<ToggleButton id={toggleId} />
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
