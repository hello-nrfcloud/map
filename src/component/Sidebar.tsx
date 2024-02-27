import { Show, type ParentProps } from 'solid-js'
import { useNavigation } from '../context/Navigation.js'
import { Sidebar as AppUpdateRequiredSidebar } from './AppUpdate.js'
import { DeviceSidebar } from './Device.js'
import { Search, Warning } from '../icons/LucideIcon.jsx'
import { Sidebar as SearchSidebar } from './Search.js'
import { WIPSidebar } from './WIPSidebar.js'
import { Sidebar as ViewSourceSidebar } from './ViewSource.js'
import { Sidebar as AddDeviceSidebar } from './AddDevice.js'
import { SidebarNav } from './SidebarNav.jsx'

import './Sidebar.css'

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

export const SidebarContent = (props: ParentProps<{ class?: string }>) => {
	return <aside class={`sidebar ${props.class ?? ''}`}>{props.children}</aside>
}

export const SearchButton = () => {
	const location = useNavigation()

	return (
		<>
			<Show
				when={location.current().panel === 'search'}
				fallback={
					<a class="button" href={location.link({ panel: 'search' })}>
						<Search strokeWidth={2} />
					</a>
				}
			>
				<a class="button active" href={location.linkToHome()}>
					<Search strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}

export const WarningButton = () => {
	const location = useNavigation()

	return (
		<>
			<Show
				when={location.current().panel === 'warning'}
				fallback={
					<a class="button warning" href={location.link({ panel: 'warning' })}>
						<Warning strokeWidth={2} />
					</a>
				}
			>
				<a class="button warning active" href={location.linkToHome()}>
					<Warning strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}
