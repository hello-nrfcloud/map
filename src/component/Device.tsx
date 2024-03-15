import {
	ModelID,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-map'
import { createMemo, For, Show } from 'solid-js'
import { byId, useDevices } from '../context/Devices.js'
import { useNavigation } from '../context/Navigation.js'
import { Device as DeviceIcon } from '../icons/Device.js'
import { Close, NoData } from '../icons/LucideIcon.js'
import { type Device } from '../resources/fetchDevices.js'
import {
	isBatteryAndPower,
	isDeviceInformation,
	isGeoLocation,
	isGeoLocationArray,
} from '../util/lwm2m.js'
import { newestInstanceFirst } from '../util/newestInstanceFirst.js'
import { DescribeModel } from './DescribeModel.js'
import { InfoBlock } from './InfoBlock.js'
import { KnownObjects } from './KnownObjects/KnownObjects.js'
import { DescribeInstance } from './lwm2m/DescribeInstance.js'
import { SidebarContent } from './Sidebar.js'
import { TutorialBoxes } from './Tutorial.jsx'

import './lwm2m/LwM2M.css'

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
				<header class="pad">
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
				<div class="scrollable">
					<Show
						when={selectedDevice() !== undefined}
						fallback={
							<section>
								<div class="boxed pad">
									<p>No state available.</p>
								</div>
							</section>
						}
					>
						<DeviceInfo device={selectedDevice()!} />
					</Show>
				</div>
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
	const instances = createMemo(() =>
		[...(props.device.state ?? [])].sort(newestInstanceFirst),
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
			<KnownObjects
				device={props.device}
				info={deviceInfo()}
				bat={bat()}
				locations={locations()}
			/>
			<TutorialBoxes />
			<Show when={otherObjects().length > 0}>
				<InfoBlock title={<h2>Other objects</h2>}>
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
				<div class="boxed">
					<For each={otherObjects()}>
						{(instance) => (
							<DescribeInstance device={props.device} instance={instance} />
						)}
					</For>
				</div>
			</Show>
			<InfoBlock title={<h2>Model</h2>}>
				<p>
					The model describes each device and optionally defines how data
					published by a device is transformed. The model definitions are
					published in{' '}
					<a
						href={`https://github.com/hello-nrfcloud/proto-map/tree/saga/models`}
						target="_blank"
					>
						this GitHub repository
					</a>
					.
				</p>
			</InfoBlock>
			<DescribeModel model={props.device.model as ModelID} />
		</section>
	)
}
