import { useDevices, type Device, byId } from '../context/Devices.js'
import { useNavigation } from '../context/Navigation.js'
import { Device as DeviceIcon } from '../icons/Device.js'
import { linkToHome } from '../util/link.js'
import { DescribeInstance } from './LwM2M.jsx'
import { Close, ExternalLink, NoData } from './LucideIcon.js'
import { SidebarContent } from './Sidebar.js'
import { Show, For, createSignal, createEffect } from 'solid-js'

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
						<div style={{ margin: '0 1rem' }}>
							<div class="boxed">
								<p class="device-info">
									<code>{location().deviceId ?? ''}</code>
								</p>
							</div>
							<div class="boxed">
								<p>No state available.</p>
							</div>
						</div>
					}
				>
					<DeviceInfo device={selectedDevice()!} />
				</Show>
			</SidebarContent>
		</Show>
	)
}

const DeviceInfo = ({ device }: { device: Device }) => (
	<div style={{ margin: '0 1rem' }}>
		<div class="boxed light">
			<p class="device-info">
				<code>{device.id}</code>
				<br />
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
			</p>
		</div>
		<Show
			when={device.state !== undefined}
			fallback={
				<div class="boxed">
					<p>No state available.</p>
				</div>
			}
		>
			<For each={device.state}>
				{(instance) => (
					<div class="boxed">
						<DescribeInstance instance={instance} />
					</div>
				)}
			</For>
		</Show>
	</div>
)
