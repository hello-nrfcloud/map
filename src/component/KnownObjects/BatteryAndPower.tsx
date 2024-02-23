import { Battery } from '../LucideIcon.js'
import { instanceTs } from '../../util/instanceTs.js'
import { RelativeTime } from '../RelativeTime.js'
import './DeviceInformation.css'
import type { BatteryAndPower_14202 } from '@hello.nrfcloud.com/proto-lwm2m'
import { ResourcesDL } from '../ResourcesDL.js'

export const Icon = () => <Battery strokeWidth={1} size={24} />

export const Card = ({ bat }: { bat: BatteryAndPower_14202 }) => (
	<>
		<ResourcesDL>
			<dt>Voltage</dt>
			<dd>{bat['Resources'][1]} V</dd>
		</ResourcesDL>
		<RelativeTime time={instanceTs(bat)} />
	</>
)
