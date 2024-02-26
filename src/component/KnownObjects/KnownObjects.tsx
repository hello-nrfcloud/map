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
	createMemo,
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
import { DescribeInstance } from '../LwM2M.jsx'

import './KnownObjects.css'

type Objects = {
	info: DeviceInformation_14204 | undefined
	bat: BatteryAndPower_14202 | undefined
	locations: Geolocation_14201[]
}

export const KnownObjects = (objects: Objects) => {
	const hasLocations = createMemo(() => objects.locations.length > 0)

	const tabs = createMemo(() => {
		const tabs = []
		if (hasLocations()) tabs.push('location')
		if (objects.info !== undefined) tabs.push('info')
		if (objects.bat !== undefined) tabs.push('bat')
		return tabs
	})

	const [visibleCard, setVisibleCard] = createSignal<string | undefined>(
		tabs()[0],
	)

	return (
		<section class="known-objects boxed">
			<nav class="tabs">
				<Show when={hasLocations()}>
					<Tab id={'location'} visibleCard={[visibleCard, setVisibleCard]}>
						<LocationIcon />
					</Tab>
				</Show>
				<Show when={objects.info !== undefined}>
					<Tab id={'info'} visibleCard={[visibleCard, setVisibleCard]}>
						<DeviceInformationIcon />
					</Tab>
				</Show>
				<Show when={objects.bat !== undefined}>
					<Tab id={'bat'} visibleCard={[visibleCard, setVisibleCard]}>
						<BatteryAndPowerIcon />
					</Tab>
				</Show>
			</nav>
			<div class="cards">
				<Show when={visibleCard() === 'info' && objects.info !== undefined}>
					<DeviceInformationCard info={objects.info!} />
				</Show>
				<Show when={visibleCard() === 'bat' && objects.bat !== undefined}>
					<BatteryAndPowerCard bat={objects.bat!} />
				</Show>
				<Show when={visibleCard() === 'location' && hasLocations}>
					<LocationCard locations={objects.locations} />
				</Show>
			</div>
			<footer>
				<Show when={visibleCard() === 'info' && objects.info !== undefined}>
					<DescribeInstance instance={objects.info!} />
				</Show>
				<Show when={visibleCard() === 'bat' && objects.bat !== undefined}>
					<DescribeInstance instance={objects.bat!} />
				</Show>
				<Show when={visibleCard() === 'location' && hasLocations}>
					<For each={objects.locations}>
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
) => {
	return (
		<button
			type="button"
			onClick={() => props.visibleCard[1](props.id)}
			class={props.visibleCard[0]() === props.id ? 'active' : ''}
		>
			{props.children}
		</button>
	)
}
