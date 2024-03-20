import {
	type BatteryAndPower_14202,
	type DeviceInformation_14204,
	type Geolocation_14201,
} from '@hello.nrfcloud.com/proto-map'
import { For, Show, createMemo, type ParentProps } from 'solid-js'
import { useNavigation } from '../../context/Navigation.js'
import type { Device } from '../../resources/fetchDevices.js'
import { DescribeInstance } from '../lwm2m/DescribeInstance.js'
import {
	Card as BatteryAndPowerCard,
	Icon as BatteryAndPowerIcon,
} from './BatteryAndPower.js'
import {
	Card as DeviceInformationCard,
	Icon as DeviceInformationIcon,
} from './DeviceInformation.js'
import { Card as LocationCard, Icon as LocationIcon } from './Location.js'
import { Card as PinnedCard, Icon as PinnedIcon } from './Pinned.js'

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
			.pinnedResources.filter(({ model }) => model === props.device.model),
	)

	const tabs = createMemo(() => {
		const tabs: TabType[] = []
		if (favoriteResources().length > 0) tabs.push(TabType.Pinned)
		if (props.info !== undefined) tabs.push(TabType.Info)
		if (props.bat !== undefined) tabs.push(TabType.Bat)
		if (hasLocations()) tabs.push(TabType.Location)
		return tabs
	})

	const nonSelected = () =>
		tabs().find((id) => location.isToggled(toggleId(id))) === undefined
	const isActive = (id: TabType): boolean =>
		location.isToggled(toggleId(id)) || (nonSelected() && id === tabs()[0])
	const setActive = (id: TabType): void => {
		const toggled: Record<string, boolean> = {
			[toggleId(id)]: true,
		}
		for (const offtabId of tabs().filter((i) => i !== id)) {
			toggled[toggleId(offtabId)] = false
		}
		location.toggleBatch(toggled)
	}

	return (
		<section class="known-objects boxed">
			<div>
				<nav class="tabs pad">
					<Show when={tabs().includes(TabType.Pinned)}>
						<Tab
							isActive={isActive(TabType.Pinned)}
							onClick={() => setActive(TabType.Pinned)}
						>
							<PinnedIcon />
						</Tab>
					</Show>
					<Show when={tabs().includes(TabType.Info)}>
						<Tab
							isActive={isActive(TabType.Info)}
							onClick={() => setActive(TabType.Info)}
						>
							<DeviceInformationIcon />
						</Tab>
					</Show>
					<Show when={tabs().includes(TabType.Bat)}>
						<Tab
							isActive={isActive(TabType.Bat)}
							onClick={() => setActive(TabType.Bat)}
						>
							<BatteryAndPowerIcon />
						</Tab>
					</Show>
					<Show when={tabs().includes(TabType.Location)}>
						<Tab
							isActive={isActive(TabType.Location)}
							onClick={() => setActive(TabType.Location)}
						>
							<LocationIcon />
						</Tab>
					</Show>
				</nav>
				<div class="cards bg-light">
					<Show when={isActive(TabType.Pinned)}>
						<PinnedCard resources={favoriteResources()} device={props.device} />
					</Show>
					<Show when={isActive(TabType.Info) && props.info !== undefined}>
						<DeviceInformationCard info={props.info!} />
					</Show>
					<Show when={isActive(TabType.Bat) && props.bat !== undefined}>
						<BatteryAndPowerCard bat={props.bat!} />
					</Show>
					<Show when={isActive(TabType.Location) && hasLocations}>
						<LocationCard locations={props.locations} />
					</Show>
				</div>
			</div>
			<Show when={isActive(TabType.Info) && props.info !== undefined}>
				<DescribeInstance device={props.device} instance={props.info!} />
			</Show>
			<Show when={isActive(TabType.Bat) && props.bat !== undefined}>
				<DescribeInstance device={props.device} instance={props.bat!} />
			</Show>
			<Show when={isActive(TabType.Location) && hasLocations}>
				<For each={props.locations}>
					{(location) => (
						<DescribeInstance device={props.device} instance={location} />
					)}
				</For>
			</Show>
		</section>
	)
}

const Tab = (
	props: ParentProps<{
		isActive: boolean
		onClick: () => void
	}>,
) => (
	<button
		type="button"
		onClick={props.onClick}
		class={props.isActive ? 'active' : ''}
	>
		{props.children}
	</button>
)

const toggleId = (type: TabType): string => `ko;${type}`
