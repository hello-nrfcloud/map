import { useDevices, type Device, byId } from '../context/Devices.js'
import { useNavigation } from '../context/Navigation.js'
import { Device as DeviceIcon } from '../icons/Device.js'
import { linkToHome, linkToPanel } from '../util/link.js'
import { DescribeInstance } from './LwM2M.jsx'
import { Close, Documentation, NoData, Search } from '../icons/LucideIcon.jsx'
import { SidebarContent } from './Sidebar.js'
import { Show, For, createSignal, createEffect } from 'solid-js'
import { newestInstanceFirst } from '../util/instanceTs.js'
import { type LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-lwm2m'
import { InfoBlock } from './InfoBlock.jsx'
import { KnownObjects } from './KnownObjects/KnownObjects.jsx'
import {
	isBatteryAndPower,
	isDeviceInformation,
	isGeoLocation,
	isGeoLocationArray,
} from '../util/lwm2m.js'
import { SourceInfo } from './SourceInfo.jsx'

import './LwM2M.css'

export const SidebarButton = () => {
	const location = useNavigation()
	return (
		<Show
			when={
				location().deviceId !== undefined && location().deviceId !== undefined
			}
		>
			<>
				<a class="button active" href={linkToHome()}>
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
	const [selectedDevice, setSelectedDevice] = createSignal<Device>()

	createEffect(() => {
		setSelectedDevice(devices().find(byId(location().deviceId ?? '')))
	})

	return (
		<Show when={location().deviceId !== undefined}>
			<SidebarContent class="device">
				<header>
					<h1>
						<span>{location().deviceId}</span>
						<Show when={selectedDevice() === undefined}>
							<NoData strokeWidth={1} size={20} />
						</Show>
					</h1>
					<a href={linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<Show
					when={selectedDevice() !== undefined}
					fallback={
						<section>
							<div class="boxed">
								<p>
									<code>{location().deviceId ?? ''}</code>
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

const DeviceInfo = ({ device }: { device: Device }) => {
	const instances = (device.state ?? []).sort(newestInstanceFirst)
	const otherObjects = instances.filter(isGenericObject)

	const maybeDeviceInfo = instances.find(isDeviceInformation)
	const deviceInfo = isDeviceInformation(maybeDeviceInfo)
		? maybeDeviceInfo
		: undefined

	const maybeBatteryAndPower = instances.find(isBatteryAndPower)
	const bat = isBatteryAndPower(maybeBatteryAndPower)
		? maybeBatteryAndPower
		: undefined

	const maybeGeolocations = instances.filter(isGeoLocation)
	const locations = isGeoLocationArray(maybeGeolocations)
		? maybeGeolocations
		: []

	return (
		<section>
			<Show when={device.state === undefined}>
				<div class="boxed">
					<p>No objects newer than 30 days are available.</p>
				</div>
			</Show>
			<KnownObjects info={deviceInfo} bat={bat} locations={locations} />
			<Show when={otherObjects.length > 0}>
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
				<For each={otherObjects}>
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
					when={device.model === 'world.thingy.rocks'}
					fallback={
						<SourceInfo>
							<p>
								<Documentation size={16} strokeWidth={1} />
								<a
									href={`https://github.com/hello-nrfcloud/proto-lwm2m/tree/saga/models/${encodeURIComponent(device.model)}`}
									target="_blank"
								>
									Model definition for <code>{device.model}</code>
								</a>
							</p>
							<p>
								<Search size={16} strokeWidth={1} />
								<a
									href={linkToPanel(
										`search`,
										new URLSearchParams({ model: device.model }),
									)}
								>
									Search for all devices with model <code>{device.model}</code>
								</a>
							</p>
						</SourceInfo>
					}
				>
					<SourceInfo>
						<p>
							<a
								href={`https://world.thingy.rocks/#${device.id}`}
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
