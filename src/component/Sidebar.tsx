import { Show, type ParentProps } from 'solid-js'
import { useNavigation } from '../context/Navigation.js'
import { linkAsset, linkToHome, linkToPanel } from '../util/link.js'
import {
	SidebarButton as AppUpdateRequiredButton,
	Sidebar as AppUpdateRequiredSidebar,
} from './AppUpdate.js'
import { DeviceSidebar, SidebarButton as DeviceDetailButton } from './Device.js'
import { Search, Warning } from '../icons/LucideIcon.jsx'
import { Sidebar as SearchSidebar } from './Search.js'
import './Sidebar.css'
import { WIPSidebar } from './WIPSidebar.js'
import {
	Sidebar as ViewSourceSidebar,
	SidebarButton as ViewSourceButton,
} from './ViewSource.js'
import {
	Sidebar as AddDeviceSidebar,
	SidebarButton as AddDeviceButton,
} from './AddDevice.js'

export const Sidebar = () => (
	<>
		<SidebarNav />
		<WIPSidebar />
		<DeviceSidebar />
		<SearchSidebar />
		<AppUpdateRequiredSidebar />
		<ViewSourceSidebar />
		<AddDeviceSidebar />
	</>
)

export const SidebarContent = (props: ParentProps<{ class?: string }>) => (
	<aside class={`sidebar ${props.class ?? ''}`}>{props.children}</aside>
)

const SidebarNav = () => (
	<nav class="sidebar">
		<AppUpdateRequiredButton />
		<a href={linkToHome()} class="button">
			<img
				src={linkAsset('logo.svg')}
				class="logo"
				alt="hello.nrfcloud.com logo"
			/>
		</a>
		<hr />
		<WarningButton />
		<SearchButton />
		<DeviceDetailButton />
		<AddDeviceButton />
		<ViewSourceButton />
	</nav>
)

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
