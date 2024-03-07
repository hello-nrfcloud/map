import { Show, createSignal, For } from 'solid-js'
import { CopyableProp } from './CopyableProp.jsx'
import { useParameters } from '../context/Parameters.jsx'
import { CollapseButton } from './CollapseButton.jsx'
import { ResourcesDL } from './ResourcesDL.jsx'

export const DescribeConnectionSettings = (props: { deviceId: string }) => {
	const parameters = useParameters()
	const [expanded, setExpanded] = createSignal<boolean>(false)

	return (
		<aside class="boxed">
			<header class="rounded-header">
				<h3>Connection information</h3>
				<CollapseButton expanded={expanded} setExpanded={setExpanded} />
			</header>
			<Show when={expanded()}>
				<ResourcesDL class="pad">
					<For
						each={
							[
								['Client ID', props.deviceId],
								['MQTT Endpoint', 'mqtt.nrfcloud.com'],
								[
									'MQTT SenML topic',
									`prod/${parameters.nrfCloudTeamId}/m/senml/${props.deviceId}`,
								],
								['CoAP Endpoint', 'coap.nrfcloud.com'],
								['CoAP SenML resource', '/msg/d2c/raw'],
							] as Array<[string, string]>
						}
					>
						{([k, v]) => <CopyableProp name={k} value={v} />}
					</For>
				</ResourcesDL>
			</Show>
		</aside>
	)
}
