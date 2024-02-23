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
import { RelativeTime } from '../RelativeTime.jsx'
import { instanceTs } from '../../util/instanceTs.js'
import { DescribeInstance } from '../LwM2M.jsx'

type Objects = {
	info: DeviceInformation_14204 | undefined
	bat: BatteryAndPower_14202 | undefined
	locations: Geolocation_14201[]
}

export const KnownObjects = (objects: Objects) => {
	const { info, bat, locations } = objects

	const tabs = []

	for (const location of objects.locations) {
		tabs.push(toKey(location))
	}
	if (objects.info !== undefined) tabs.push('info')
	if (objects.bat !== undefined) tabs.push('bat')

	const [visibleCard, setVisibleCard] = createSignal<string | undefined>(
		tabs[0],
	)

	return (
		<section class="known-objects boxed">
			<nav class="tabs">
				<For each={locations}>
					{(location) => (
						<Tab
							id={toKey(location)}
							visibleCard={[visibleCard, setVisibleCard]}
						>
							<LocationIcon location={location} />
						</Tab>
					)}
				</For>
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
					<RelativeTime time={instanceTs(info!)} />
				</Show>
				<Show when={visibleCard() === 'bat' && bat !== undefined}>
					<BatteryAndPowerCard bat={bat!} />
				</Show>
				<For each={locations}>
					{(location) => (
						<Show when={visibleCard() === toKey(location)}>
							<LocationCard location={location} />
						</Show>
					)}
				</For>
			</div>
			<footer>
				<Show when={visibleCard() === 'info' && info !== undefined}>
					<DescribeInstance instance={info!} />
				</Show>
				<Show when={visibleCard() === 'bat' && bat !== undefined}>
					<DescribeInstance instance={bat!} />
				</Show>
				<For each={locations}>
					{(location) => (
						<Show when={visibleCard() === toKey(location)}>
							<DescribeInstance instance={location} />
						</Show>
					)}
				</For>
			</footer>
		</section>
	)
}

const toKey = (location: Geolocation_14201): string =>
	`location-${location.Resources[6]}`

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
