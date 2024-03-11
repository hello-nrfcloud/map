import { Battery } from '../../icons/LucideIcon.js'
import type { BatteryAndPower_14202 } from '@hello.nrfcloud.com/proto-lwm2m'
import { ResourcesDL } from '../ResourcesDL.js'
import { Show, createMemo } from 'solid-js'

import './DeviceInformation.css'

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
	return (
		<ResourcesDL>
			<Show when={SoC() !== undefined}>
				<dt>State of charge</dt>
				<dd>{SoC()!} %</dd>
			</Show>
			<Show when={voltage() !== undefined}>
				<dt>Voltage</dt>
				<dd>{voltage()!} V</dd>
			</Show>
			<Show when={current() !== undefined}>
				<dt>Current</dt>
				<dd>{current()!} mA</dd>
			</Show>
			<Show when={temp() !== undefined}>
				<dt>Temperature</dt>
				<dd>{temp()!}°C</dd>
			</Show>
			<Show when={ttf() !== undefined}>
				<dt>Time to full</dt>
				<dd>{ttf()!} s</dd>
			</Show>
			<Show when={tte() !== undefined}>
				<dt>Time to empty</dt>
				<dd>{tte()!} s</dd>
			</Show>
		</ResourcesDL>
	)
}
