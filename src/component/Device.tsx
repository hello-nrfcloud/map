import { useDevices, type Device, byId } from '../context/Devices.js'
import { useNavigation } from '../context/Navigation.js'
import { Device as DeviceIcon } from '../icons/Device.js'
import { linkToHome } from '../util/link.js'
import { DescribeInstance } from './LwM2M.jsx'
import { Close, ExternalLink, NoData } from './LucideIcon.js'
import { SidebarContent } from './Sidebar.js'
import { Show, For, createSignal, createEffect } from 'solid-js'
import { newestInstanceFirst } from '../util/instanceTs.js'
import {
	type LwM2MObjectInstance,
	type DeviceInformation_14204,
	type BatteryAndPower_14202,
	LwM2MObjectID,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { InfoBlock } from './InfoBlock.jsx'
import { KnownObjects } from './KnownObjects/KnownObjects.jsx'

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
						<span>Device</span>
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
								<p class="device-info">
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
	return true
}

export const isDeviceInformation = (
	instance?: LwM2MObjectInstance,
): instance is DeviceInformation_14204 =>
	instance !== undefined &&
	instance.ObjectID === LwM2MObjectID.DeviceInformation_14204

export const isBatteryAndPower = (
	instance?: LwM2MObjectInstance,
): instance is BatteryAndPower_14202 =>
	instance !== undefined &&
	instance.ObjectID === LwM2MObjectID.BatteryAndPower_14202

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

	return (
		<section>
			<div class="boxed light">
				<p class="device-info">
					<code>{device.id}</code>
					<br />
					<Show
						when={device.model === 'world.thingy.rocks'}
						fallback={
							<small>
								Model:{' '}
								<a
									href={`https://github.com/hello-nrfcloud/proto-lwm2m/tree/saga/models/${encodeURIComponent(device.model)}`}
									target="_blank"
								>
									{device.model}
									<ExternalLink size={16} strokeWidth={1} />
								</a>
							</small>
						}
					>
						<small>
							<a
								href={`https://world.thingy.rocks/#${device.id}`}
								target="_blank"
							>
								world.thingy.rocks legacy device
								<ExternalLink size={16} strokeWidth={1} />
							</a>
						</small>
					</Show>
				</p>
			</div>
			<Show when={device.state === undefined}>
				<div class="boxed">
					<p>No state available.</p>
				</div>
			</Show>
			<KnownObjects info={deviceInfo} bat={bat} />
			<Show when={otherObjects.length > 0}>
				<InfoBlock title={'Other objects'}>
					<p>
						These objects have been published by the device, but there is no
						custom handling in this application for the data, yet. Consider
						creating a feature request{' '}
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
		</section>
	)
}
