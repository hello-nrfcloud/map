import { type LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-lwm2m'
import { For, Show, createMemo } from 'solid-js'
import { byId, useDevices, type Device } from '../context/Devices.js'
import { useNavigation } from '../context/Navigation.js'
import { Device as DeviceIcon } from '../icons/Device.js'
import { Close, Documentation, NoData, Search } from '../icons/LucideIcon.jsx'
import { newestInstanceFirst } from '../util/instanceTs.js'
import {
	isBatteryAndPower,
	isDeviceInformation,
	isGeoLocation,
	isGeoLocationArray,
} from '../util/lwm2m.js'
import { InfoBlock } from './InfoBlock.jsx'
import { KnownObjects } from './KnownObjects/KnownObjects.jsx'
import { DescribeInstance } from './LwM2M.jsx'
import { SidebarContent } from './Sidebar.js'
import { SourceInfo } from './SourceInfo.jsx'

import './LwM2M.css'
import { SearchTermType } from '../context/Search.js'

export const SidebarButton = () => {
	const location = useNavigation()
	return (
		<Show when={location.current().panel.startsWith('id:')}>
			<>
				<a class="button active" href={location.linkToHome()}>
					<DeviceIcon class="logo" />
				</a>
				<hr />
			</>
		</Show>
	)
}

export const DeviceSidebar = () => {
	const location = useNavigation()
	const devices = useDevices()
	const deviceId = createMemo(() =>
		location.current().panel.startsWith('id:')
			? location.current().panel.split(':', 2)[1]
			: undefined,
	)
	const selectedDevice = createMemo(() => {
		const id = deviceId()
		return id !== undefined ? devices().find(byId(id)) : undefined
	})

	return (
		<Show when={deviceId() !== undefined}>
			<SidebarContent class="device">
				<header>
					<h1>
						<span>{deviceId()}</span>
						<Show when={selectedDevice() === undefined}>
							<NoData strokeWidth={1} size={20} />
						</Show>
					</h1>
					<a href={location.linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<Show
					when={selectedDevice() !== undefined}
					fallback={
						<section>
							<div class="boxed">
								<p>
									<code>{deviceId()}</code>
								</p>
							</div>
							<div class="boxed">
								<p>No state available.</p>
							</div>
						</section>
					}
				>
					<DeviceInfo device={selectedDevice()!} />
				</Show>
			</SidebarContent>
		</Show>
	)
}

const isGenericObject = (instance: LwM2MObjectInstance): boolean => {
	if (isDeviceInformation(instance)) return false
	if (isBatteryAndPower(instance)) return false
	if (isGeoLocation(instance)) return false
	return true
}

const DeviceInfo = (props: { device: Device }) => {
	const location = useNavigation()
	const instances = createMemo(() =>
		(props.device.state ?? []).sort(newestInstanceFirst),
	)
	const otherObjects = createMemo(() => instances().filter(isGenericObject))
	const deviceInfo = createMemo(() => {
		const maybeDeviceInfo = instances().find(isDeviceInformation)
		return isDeviceInformation(maybeDeviceInfo) ? maybeDeviceInfo : undefined
	})

	const bat = createMemo(() => {
		const maybeBatteryAndPower = instances().find(isBatteryAndPower)
		return isBatteryAndPower(maybeBatteryAndPower)
			? maybeBatteryAndPower
			: undefined
	})

	const locations = createMemo(() => {
		const maybeGeolocations = instances().filter(isGeoLocation)
		return isGeoLocationArray(maybeGeolocations) ? maybeGeolocations : []
	})

	return (
		<section>
			<Show when={props.device.state === undefined}>
				<div class="boxed">
					<p>No objects newer than 30 days are available.</p>
				</div>
			</Show>
			<KnownObjects info={deviceInfo()} bat={bat()} locations={locations()} />
			<Show when={otherObjects().length > 0}>
				<InfoBlock title={'Other objects'}>
					<p>
						These objects have been published by the device in the last 30 days,
						but there is no custom handling in this application for the data,
						yet. Consider creating a feature request{' '}
						<a href={REPOSITORY_URL} target="_blank">
							here
						</a>
						.
					</p>
				</InfoBlock>
				<For each={otherObjects()}>
					{(instance) => (
						<div class="boxed">
							<DescribeInstance instance={instance} />
						</div>
					)}
				</For>
			</Show>
			<InfoBlock title={'Model'}>
				<p>
					The model describes each device and optionally defines how data
					published by a device is transformed. The model definitions are
					published in{' '}
					<a
						href={`https://github.com/hello-nrfcloud/proto-lwm2m/tree/saga/models`}
						target="_blank"
					>
						this GitHub repository
					</a>
					.
				</p>
			</InfoBlock>
			<div class="boxed">
				<Show
					when={props.device.model === 'world.thingy.rocks'}
					fallback={
						<SourceInfo>
							<p>
								<Documentation size={16} strokeWidth={1} />
								<a
									href={`https://github.com/hello-nrfcloud/proto-lwm2m/tree/saga/models/${encodeURIComponent(props.device.model)}`}
									target="_blank"
								>
									Model definition for <code>{props.device.model}</code>
								</a>
							</p>
							<p>
								<Search size={16} strokeWidth={1} />
								<a
									href={location.link({
										panel: 'search',
										search: [
											{
												type: SearchTermType.Model,
												term: props.device.model,
											},
										],
									})}
								>
									Search for all devices with model{' '}
									<code>{props.device.model}</code>
								</a>
							</p>
						</SourceInfo>
					}
				>
					<SourceInfo>
						<p>
							<a
								href={`https://world.thingy.rocks/#${props.device.id}`}
								target="_blank"
							>
								world.thingy.rocks legacy device
							</a>
						</p>
					</SourceInfo>
				</Show>
			</div>
		</section>
	)
}
