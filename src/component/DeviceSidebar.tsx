import { useDevices, type Device, byId } from '../context/Devices.jsx'
import { useNavigation } from '../context/Navigation.jsx'
import { linkToHome } from '../util/link.js'
import { Close } from './LucideIcon.js'
import { SidebarContent } from './Sidebar.js'
import { Show, createSignal, createEffect } from 'solid-js'

export const DeviceSidebar = () => {
	const location = useNavigation()
	const devices = useDevices()
	const [selectedDevice, setSelectedDevice] = createSignal<Device>()

	createEffect(() => {
		setSelectedDevice(devices().find(byId(location().deviceId ?? '')))
	})

	return (
		<Show when={selectedDevice() !== undefined}>
			<DeviceInfo device={selectedDevice()!} />
		</Show>
	)
}

const DeviceInfo = ({ device }: { device: Device }) => (
	<SidebarContent>
		<header>
			<h1>
				<code>{device.id}</code>
			</h1>
			<a href={linkToHome()} class="close">
				<Close size={20} />
			</a>
		</header>
		<div style={{ margin: '0 1rem' }}>
			<div class="boxed">
				<p>Model: {device.model}</p>
			</div>
		</div>
	</SidebarContent>
)
