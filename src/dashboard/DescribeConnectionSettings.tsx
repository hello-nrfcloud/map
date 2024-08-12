import { ResourcesDL } from '#component/ResourcesDL.js'
import { useParameters } from '#context/Parameters.js'
import { CopyableProp } from '#dashboard/CopyableProp.js'

export const DescribeConnectionSettings = (props: {
	deviceId: string
	class?: string
}) => {
	const parameters = useParameters()

	return (
		<div class={props.class ?? ''}>
			<h2 class="pad-b">Connection information</h2>
			<ResourcesDL>
				<CopyableProp name={'Client ID'} value={props.deviceId} />
				<CopyableProp name={'CoAP Endpoint'} value={'coap.nrfcloud.com'} />
				<CopyableProp name={'CoAP SenML resource'} value={'/msg/d2c/raw'} />
				<CopyableProp name={'MQTT Endpoint'} value={'mqtt.nrfcloud.com'} />
				<CopyableProp
					name={'MQTT SenML topic'}
					value={`prod/${parameters.nrfCloudTeamId}/m/d/${props.deviceId}/d2c/senml		`}
				/>
			</ResourcesDL>
		</div>
	)
}
