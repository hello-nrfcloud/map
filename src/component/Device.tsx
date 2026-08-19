import { byId, useDevices } from '#context/Devices.tsx'
import { useNavigation } from '#context/Navigation.tsx'
import { useViteEnv } from '#context/ViteEnv.tsx'
import { Device as DeviceIcon } from '#icons/Device.tsx'
import { Close } from '#icons/LucideIcon.tsx'
import { type Device } from '#resources/fetchDevices.ts'
import {
	isBatteryAndPower,
	isDeviceInformation,
	isGeoLocation,
	isGeoLocationArray,
} from '#util/lwm2m.ts'
import { newestInstanceFirst } from '#util/newestInstanceFirst.ts'
import { type LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-map/lwm2m'
import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import { content } from 'map:tutorial-content'
import { createMemo, For, Show } from 'solid-js'
import { DescribeModel } from './DescribeModel.tsx'
import { InfoBlock } from './InfoBlock.tsx'
import { KnownObjects } from './KnownObjects/KnownObjects.tsx'
import { DescribeInstance } from './lwm2m/DescribeInstance.tsx'
import { SidebarContent } from './Sidebar/SidebarContent.tsx'
import { TutorialHighlight } from './Tutorial/TutorialHighlight.tsx'

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
	let scrollableRef: HTMLDivElement | undefined
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

	const tutorial = () => content[location.current().tutorial ?? '']

	return (
		<Show when={deviceId() !== undefined}>
			<SidebarContent class="device" id="device">
				<header class="pad">
					<h1>
						<span>{deviceId()}</span>
					</h1>
					<a href={location.linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<div
					class="scrollable"
					style={{ position: 'relative' }}
					ref={scrollableRef}
				>
					<Show
						when={selectedDevice() !== undefined}
						fallback={
							<section>
								<div class="boxed pad">
									<p>No state available.</p>
									<p>
										Due to caching it may take up to 10 minutes for recent
										device data to be visible.
									</p>
								</div>
							</section>
						}
					>
						<Show when={tutorial() !== undefined}>
							<TutorialHighlight
								tutorial={tutorial()!}
								parent={scrollableRef!}
							/>
						</Show>
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
	const { repositoryURL } = useViteEnv()
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
			<Show when={otherObjects().length > 0}>
				<InfoBlock title={<h2>Other objects</h2>}>
					<p>
						These objects have been published by the device in the last 30 days,
						but there is no custom handling in this application for the data,
						yet. Consider creating a feature request{' '}
						<a href={repositoryURL.toString()} target="_blank">
							here
						</a>
						.
					</p>
				</InfoBlock>
				<div class="boxed" title="Other objects">
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
