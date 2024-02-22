import { Show, type ParentProps } from 'solid-js'
import { byId, useDevices } from '../context/Devices.js'
import { useNavigation } from '../context/Navigation.js'
import { Device as DeviceIcon } from '../icons/Device.js'
import { linkAsset, linkToHome, linkToPanel } from '../util/link.js'
import {
	SidebarButton as AppUpdateRequiredButton,
	Sidebar as AppUpdateRequiredSidebar,
} from './AppUpdate.jsx'
import { DeviceSidebar } from './DeviceSidebar.js'
import { Search, ViewSourceIcon, Warning } from './LucideIcon.js'
import { Sidebar as SearchSidebar } from './Search.js'
import './Sidebar.css'
import { WIPSidebar } from './WIPSidebar.jsx'

export const Sidebar = () => (
	<>
		<SidebarNav />
		<WIPSidebar />
		<DeviceSidebar />
		<SearchSidebar />
		<AppUpdateRequiredSidebar />
	</>
)

export const SidebarContent = (props: ParentProps<{ class?: string }>) => (
	<aside class={`sidebar ${props.class ?? ''}`}>{props.children}</aside>
)

const SidebarNav = () => (
	<nav class="sidebar">
		<a href={linkToHome()} class="button">
			<img
				src={linkAsset('logo.svg')}
				class="logo"
				alt="hello.nrfcloud.com logo"
			/>
		</a>
		<hr />
		<SearchButton />
		<DeviceDetailButton />
		<WarningButton />
		<AppUpdateRequiredButton />
		<ViewSourceButton />
	</nav>
)

const DeviceDetailButton = () => {
	const location = useNavigation()
	const devices = useDevices()

	return (
		<Show when={devices().find(byId(location().deviceId ?? '')) !== undefined}>
			<>
				<a class="button active" href={linkToHome()}>
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
					<a class="button" href={linkToPanel('search')}>
						<Search strokeWidth={2} />
					</a>
				}
			>
				<a class="button active" href={linkToHome()}>
					<Search strokeWidth={2} />
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
					<a class="button warning" href={linkToPanel('warning')}>
						<Warning strokeWidth={2} />
					</a>
				}
			>
				<a class="button warning active" href={linkToHome()}>
					<Warning strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}

const ViewSourceButton = () => (
	<>
		<a class="button" href={REPOSITORY_URL} target="_blank">
			<ViewSourceIcon strokeWidth={2} />
		</a>
		<hr />
	</>
)
