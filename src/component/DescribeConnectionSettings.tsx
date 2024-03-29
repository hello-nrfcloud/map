import { CopyableProp } from './CopyableProp.js'
import { useParameters } from '../context/Parameters.js'
import { ToggleButton } from './ToggleButton.jsx'
import { ResourcesDL } from './ResourcesDL.js'
import { WhenToggled } from './WhenToggled.jsx'

export const DescribeConnectionSettings = (props: { deviceId: string }) => {
	const parameters = useParameters()

	return (
		<aside class="boxed">
			<div>
				<header class="pad">
					<h3>Connection information</h3>
					<ToggleButton id="connection-information" />
				</header>
				<WhenToggled id={'connection-information'}>
					<ResourcesDL class="pad bg-light">
						<CopyableProp name={'Client ID'} value={props.deviceId} />
						<CopyableProp name={'MQTT Endpoint'} value={'mqtt.nrfcloud.com'} />
						<CopyableProp
							name={'MQTT SenML topic'}
							value={`prod/${parameters.nrfCloudTeamId}/m/senml/${props.deviceId}`}
						/>
						<CopyableProp name={'CoAP Endpoint'} value={'coap.nrfcloud.com'} />
						<CopyableProp name={'CoAP SenML resource'} value={'/msg/d2c/raw'} />
					</ResourcesDL>
				</WhenToggled>
			</div>
		</aside>
	)
}
