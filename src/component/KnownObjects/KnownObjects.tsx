import {
	type DeviceInformation_14204,
	type BatteryAndPower_14202,
	type Geolocation_14201,
} from '@hello.nrfcloud.com/proto-lwm2m'
import {
	For,
	Show,
	createSignal,
	type ParentProps,
	type Signal,
} from 'solid-js'
import {
	Icon as DeviceInformationIcon,
	Card as DeviceInformationCard,
} from './DeviceInformation.js'
import {
	Icon as BatteryAndPowerIcon,
	Card as BatteryAndPowerCard,
} from './BatteryAndPower.js'
import { Icon as LocationIcon, Card as LocationCard } from './Location.js'

import './KnownObjects.css'
import { DescribeInstance } from '../LwM2M.jsx'

type Objects = {
	info: DeviceInformation_14204 | undefined
	bat: BatteryAndPower_14202 | undefined
	locations: Geolocation_14201[]
}

export const KnownObjects = (objects: Objects) => {
	const { info, bat, locations } = objects

	const tabs = []

	const hasLocations = locations.length > 0
	if (hasLocations) tabs.push('location')
	if (objects.info !== undefined) tabs.push('info')
	if (objects.bat !== undefined) tabs.push('bat')

	const [visibleCard, setVisibleCard] = createSignal<string | undefined>(
		tabs[0],
	)

	return (
		<section class="known-objects boxed">
			<nav class="tabs">
				<Show when={hasLocations}>
					<Tab id={'location'} visibleCard={[visibleCard, setVisibleCard]}>
						<LocationIcon />
					</Tab>
				</Show>
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
				<Show when={visibleCard() === 'location' && hasLocations}>
					<LocationCard locations={locations} />
				</Show>
			</div>
			<footer>
				<Show when={visibleCard() === 'info' && info !== undefined}>
					<DescribeInstance instance={info!} />
				</Show>
				<Show when={visibleCard() === 'bat' && bat !== undefined}>
					<DescribeInstance instance={bat!} />
				</Show>
				<Show when={visibleCard() === 'location' && hasLocations}>
					<For each={locations}>
						{(location) => <DescribeInstance instance={location} />}
					</For>
				</Show>
			</footer>
		</section>
	)
}

const Tab = (
	props: ParentProps<{
		id: string
		visibleCard: Signal<string | undefined>
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
