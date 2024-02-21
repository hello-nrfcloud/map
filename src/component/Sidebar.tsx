import { createSignal, createEffect, Show, type ParentProps } from 'solid-js'
import { useNavigation } from '../context/Navigation.js'
import { link } from '../util/link.js'
import { Search, Warning } from './LucideIcon.js'
import './Sidebar.css'
import { byId, useDevices, type Device } from '../context/Devices.js'
import { Device as DeviceIcon } from '../icons/Device.js'
import { WarningSidebar } from './WarningSidebar.js'
import { DeviceSidebar } from './DeviceSidebar.js'
import { Sidebar as SearchSidebar } from './Search.js'

export const Sidebar = () => {
	const location = useNavigation()
	const devices = useDevices()
	const [selectedDevice, setSelectedDevice] = createSignal<Device>()

	createEffect(() => {
		setSelectedDevice(devices().find(byId(location().deviceId ?? '')))
	})

	return (
		<>
			<SidebarNav />
			<Show when={location().panel === 'warning'}>
				<WarningSidebar />
			</Show>
			<Show when={selectedDevice() !== undefined}>
				<DeviceSidebar device={selectedDevice() as Device} />
			</Show>
			<Show when={location().panel === 'search'}>
				<SearchSidebar />
			</Show>
		</>
	)
}

export const SidebarContent = (props: ParentProps<{ class?: string }>) => (
	<aside class={`sidebar ${props.class ?? ''}`}>{props.children}</aside>
)

const SidebarNav = () => (
	<nav class="sidebar">
		<a href={link('/#')} class="button white">
			<img
				src={link('/assets/logo.svg')}
				class="logo"
				alt="hello.nrfcloud.com logo"
			/>
		</a>
		<hr />
		<SearchButton />
		<DeviceDetailButton />
		<WarningButton />
	</nav>
)

const DeviceDetailButton = () => {
	const location = useNavigation()
	const devices = useDevices()

	return (
		<Show when={devices().find(byId(location().deviceId ?? '')) !== undefined}>
			<>
				<a class="button active" href={link('/#')}>
					<DeviceIcon class="logo" />
				</a>
				<hr />
			</>
		</Show>
	)
}

const SearchButton = () => {
	const location = useNavigation()

	return (
		<>
			<Show
				when={location().panel === 'search'}
				fallback={
					<a class="button" href={link('/#search')}>
						<Search strokeWidth={2} size={32} />
					</a>
				}
			>
				<a class="button active" href={link('/#')}>
					<Search strokeWidth={2} size={32} />
				</a>
			</Show>
			<hr />
		</>
	)
}

const WarningButton = () => {
	const location = useNavigation()

	return (
		<>
			<Show
				when={location().panel === 'warning'}
				fallback={
					<a class="button warning" href={link('/#warning')}>
						<Warning strokeWidth={2} size={32} />
					</a>
				}
			>
				<a class="button warning active" href={link('/#')}>
					<Warning strokeWidth={2} size={32} />
				</a>
			</Show>
			<hr />
		</>
	)
}
