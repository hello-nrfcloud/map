import {
	type BatteryAndPower_14202,
	type DeviceInformation_14204,
	type Geolocation_14201,
} from '@hello.nrfcloud.com/proto-lwm2m'
import {
	For,
	Show,
	createEffect,
	createMemo,
	createSignal,
	type ParentProps,
	type Signal,
} from 'solid-js'
import type { Device } from '../../resources/fetchDevices.js'
import { useNavigation } from '../../context/Navigation.js'
import { DescribeInstance } from '../lwm2m/DescribeInstance.js'
import {
	Card as BatteryAndPowerCard,
	Icon as BatteryAndPowerIcon,
} from './BatteryAndPower.js'
import {
	Card as DeviceInformationCard,
	Icon as DeviceInformationIcon,
} from './DeviceInformation.js'
import { Card as PinnedCard, Icon as PinnedIcon } from './Pinned.js'
import { Card as LocationCard, Icon as LocationIcon } from './Location.js'

import './KnownObjects.css'

enum TabType {
	Info = 'info',
	Bat = 'bat',
	Location = 'location',
	Pinned = 'pinned',
}

export const KnownObjects = (props: {
	device: Device
	info: DeviceInformation_14204 | undefined
	bat: BatteryAndPower_14202 | undefined
	locations: Geolocation_14201[]
}) => {
	const hasLocations = createMemo(() => props.locations.length > 0)
	const location = useNavigation()

	const favoriteResources = createMemo(() =>
		location
			.current()
			.resources.filter(({ model }) => model === props.device.model),
	)

	const tabs = createMemo(() => {
		const tabs: TabType[] = []
		if (favoriteResources().length > 0) tabs.push(TabType.Pinned)
		if (props.info !== undefined) tabs.push(TabType.Info)
		if (props.bat !== undefined) tabs.push(TabType.Bat)
		if (hasLocations()) tabs.push(TabType.Location)
		return tabs
	})

	const [visibleCard, setVisibleCard] = createSignal<TabType | undefined>()

	createEffect(() => {
		setVisibleCard(tabs()[0])
	})

	return (
		<section class="known-objects boxed">
			<nav class="tabs rounded-header">
				<Show when={tabs().includes(TabType.Pinned)}>
					<Tab id={TabType.Pinned} visibleCard={[visibleCard, setVisibleCard]}>
						<PinnedIcon />
					</Tab>
				</Show>
				<Show when={tabs().includes(TabType.Info)}>
					<Tab id={TabType.Info} visibleCard={[visibleCard, setVisibleCard]}>
						<DeviceInformationIcon />
					</Tab>
				</Show>
				<Show when={tabs().includes(TabType.Bat)}>
					<Tab id={TabType.Bat} visibleCard={[visibleCard, setVisibleCard]}>
						<BatteryAndPowerIcon />
					</Tab>
				</Show>
				<Show when={tabs().includes(TabType.Location)}>
					<Tab
						id={TabType.Location}
						visibleCard={[visibleCard, setVisibleCard]}
					>
						<LocationIcon />
					</Tab>
				</Show>
			</nav>
			<div class="cards">
				<Show when={visibleCard() === TabType.Pinned}>
					<PinnedCard resources={favoriteResources()} device={props.device} />
				</Show>
				<Show when={visibleCard() === TabType.Info && props.info !== undefined}>
					<DeviceInformationCard info={props.info!} />
				</Show>
				<Show when={visibleCard() === TabType.Bat && props.bat !== undefined}>
					<BatteryAndPowerCard bat={props.bat!} />
				</Show>
				<Show when={visibleCard() === TabType.Location && hasLocations}>
					<LocationCard locations={props.locations} />
				</Show>
			</div>
			<Show
				when={
					visibleCard() !== undefined &&
					[TabType.Info, TabType.Bat, TabType.Location].includes(visibleCard()!)
				}
			>
				<footer>
					<Show
						when={visibleCard() === TabType.Info && props.info !== undefined}
					>
						<DescribeInstance device={props.device} instance={props.info!} />
					</Show>
					<Show when={visibleCard() === TabType.Bat && props.bat !== undefined}>
						<DescribeInstance device={props.device} instance={props.bat!} />
					</Show>
					<Show when={visibleCard() === TabType.Location && hasLocations}>
						<For each={props.locations}>
							{(location) => (
								<DescribeInstance device={props.device} instance={location} />
							)}
						</For>
					</Show>
				</footer>
			</Show>
		</section>
	)
}

const Tab = (
	props: ParentProps<{
		id: TabType
		visibleCard: Signal<TabType | undefined>
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
