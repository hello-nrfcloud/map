import { Device } from '#icons/Device.js'
import { ResourcesDL } from '../ResourcesDL.js'
import { Show } from 'solid-js'
import type { DeviceInformation_14204 } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { identifyIssuer } from 'e118-iin-list'

import './DeviceInformation.css'

export const Icon = () => (
	<>
		<Device class="device-information" />
		<small>Device</small>
	</>
)

export const Card = (props: { info: DeviceInformation_14204 }) => (
	<ResourcesDL>
		<Show when={props.info['Resources'][1] !== undefined}>
			<dt>ICCID</dt>
			<dd>{props.info['Resources'][1]}</dd>
			<dt>SIM issued by</dt>
			<dd>
				{identifyIssuer(props.info['Resources'][1]!)?.companyName ?? '??'}
			</dd>
		</Show>
		<dt>Modem firmware version</dt>
		<dd>{props.info['Resources'][2]}</dd>
		<dt>Application firmware version</dt>
		<dd>{props.info['Resources'][3]}</dd>
		<dt>Device type</dt>
		<dd>{props.info['Resources'][4]}</dd>
	</ResourcesDL>
)
