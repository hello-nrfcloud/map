import { Battery } from '../../icons/LucideIcon.js'
import {
	definitions,
	LwM2MObjectID,
	type BatteryAndPower_14202,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { ResourcesDL } from '../ResourcesDL.js'
import { Show, createMemo } from 'solid-js'

import './DeviceInformation.css'
import { DescribeScalarValue } from '../lwm2m/DescribeScalarValue.js'

export const Icon = () => (
	<>
		<Battery strokeWidth={1} size={24} />
		<small>Power</small>
	</>
)

export const Card = (props: { bat: BatteryAndPower_14202 }) => {
	const voltage = createMemo(() => props.bat.Resources[1])
	const SoC = createMemo(() => props.bat.Resources[0])
	const current = createMemo(() => props.bat.Resources[2])
	const temp = createMemo(() => props.bat.Resources[3])
	const ttf = createMemo(() => props.bat.Resources[4])
	const tte = createMemo(() => props.bat.Resources[5])
	const info = definitions[LwM2MObjectID.BatteryAndPower_14202].Resources
	return (
		<ResourcesDL>
			<Show when={SoC() !== undefined}>
				<dt>State of charge</dt>
				<dd>
					<DescribeScalarValue value={SoC()!} info={info[0]!} />
				</dd>
			</Show>
			<Show when={voltage() !== undefined}>
				<dt>Voltage</dt>
				<dd>
					<DescribeScalarValue value={voltage()!} info={info[1]!} />
				</dd>
			</Show>
			<Show when={current() !== undefined}>
				<dt>Current</dt>
				<dd>
					<DescribeScalarValue value={current()!} info={info[2]!} />
				</dd>
			</Show>
			<Show when={temp() !== undefined}>
				<dt>Temperature</dt>
				<dd>
					<DescribeScalarValue value={temp()!} info={info[3]!} />
				</dd>
			</Show>
			<Show when={ttf() !== undefined}>
				<dt>Time to full</dt>
				<dd>
					<DescribeScalarValue value={ttf()!} info={info[4]!} />
				</dd>
			</Show>
			<Show when={tte() !== undefined}>
				<dt>Time to empty</dt>
				<dd>
					<DescribeScalarValue value={tte()!} info={info[5]!} />
				</dd>
			</Show>
		</ResourcesDL>
	)
}
