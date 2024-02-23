import { useDevices, type Device, byId } from '../context/Devices.js'
import { useNavigation } from '../context/Navigation.js'
import { Device as DeviceIcon } from '../icons/Device.js'
import { linkToHome } from '../util/link.js'
import { DescribeInstance } from './LwM2M.jsx'
import { Close, ExternalLink, NoData } from './LucideIcon.js'
import { SidebarContent } from './Sidebar.js'
import { Show, For, createSignal, createEffect } from 'solid-js'
import { newestInstanceFirst } from '../util/instanceTs.js'

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

const DeviceInfo = ({ device }: { device: Device }) => (
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
		<Show
			when={device.state !== undefined}
			fallback={
				<div class="boxed">
					<p>No state available.</p>
				</div>
			}
		>
			<For each={(device.state ?? []).sort(newestInstanceFirst)}>
				{(instance) => (
					<div class="boxed">
						<DescribeInstance instance={instance} />
					</div>
				)}
			</For>
		</Show>
	</section>
)
