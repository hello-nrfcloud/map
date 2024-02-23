import {
	type DeviceInformation_14204,
	type BatteryAndPower_14202,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { Show, createSignal, type ParentProps, type Signal } from 'solid-js'
import {
	Icon as DeviceInformationIcon,
	Card as DeviceInformationCard,
} from './DeviceInformation.js'
import {
	Icon as BatteryAndPowerIcon,
	Card as BatteryAndPowerCard,
} from './BatteryAndPower.js'

import './KnownObjects.css'

type Objects = {
	info: DeviceInformation_14204 | undefined
	bat: BatteryAndPower_14202 | undefined
}
type ObjectKey = keyof Objects

export const KnownObjects = (objects: Objects) => {
	const { info, bat } = objects
	const [visibleCard, setVisibleCard] = createSignal<ObjectKey | undefined>(
		(Object.keys(objects) as ObjectKey[]).find((k) => objects[k] !== undefined),
	)

	return (
		<section class="known-objects boxed">
			<nav>
				<Show when={info !== undefined}>
					<Tab id={'info'} visibleCard={[visibleCard, setVisibleCard]}>
						<DeviceInformationIcon />
					</Tab>
				</Show>
				<Show when={bat !== undefined}>
					<Tab id={'bat'} visibleCard={[visibleCard, setVisibleCard]}>
						<BatteryAndPowerIcon />
					</Tab>
				</Show>
			</nav>
			<div class="cards">
				<Show when={visibleCard() === 'info' && info !== undefined}>
					<DeviceInformationCard info={info!} />
				</Show>
				<Show when={visibleCard() === 'bat' && bat !== undefined}>
					<BatteryAndPowerCard bat={bat!} />
				</Show>
			</div>
		</section>
	)
}

const Tab = (
	props: ParentProps<{
		id: ObjectKey
		visibleCard: Signal<ObjectKey | undefined>
	}>,
) => (
	<button
		type="button"
		onClick={() => props.visibleCard[1](props.id)}
		class={props.visibleCard[0]() === props.id ? 'active' : ''}
	>
		{props.children}
	</button>
)
