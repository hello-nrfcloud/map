import { Show, createSignal } from 'solid-js'
import { CopyableProp } from './CopyableProp.js'
import { useParameters } from '../context/Parameters.js'
import { CollapseButton } from './CollapseButton.js'
import { ResourcesDL } from './ResourcesDL.js'

export const DescribeConnectionSettings = (props: { deviceId: string }) => {
	const parameters = useParameters()
	const [expanded, setExpanded] = createSignal<boolean>(false)

	return (
		<aside class="boxed">
			<div>
				<header class="rounded-header">
					<h3>Connection information</h3>
					<CollapseButton expanded={expanded} setExpanded={setExpanded} />
				</header>
				<Show when={expanded()}>
					<ResourcesDL class="pad">
						<CopyableProp name={'Client ID'} value={props.deviceId} />
						<CopyableProp name={'MQTT Endpoint'} value={'mqtt.nrfcloud.com'} />
						<CopyableProp
							name={'MQTT SenML topic'}
							value={`prod/${parameters.nrfCloudTeamId}/m/senml/${props.deviceId}`}
						/>
						<CopyableProp name={'CoAP Endpoint'} value={'coap.nrfcloud.com'} />
						<CopyableProp name={'CoAP SenML resource'} value={'/msg/d2c/raw'} />
					</ResourcesDL>
				</Show>
			</div>
		</aside>
	)
}
