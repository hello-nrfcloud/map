import { Show, type ParentProps } from 'solid-js'
import { useNavigation } from '../context/Navigation.js'
import { DeviceSidebar } from './Device.js'
import { ActiveSearch, Search, Warning } from '../icons/LucideIcon.js'
import { Sidebar as SearchSidebar } from './Search.js'
import { WIPSidebar } from './WIPSidebar.js'
import { Sidebar as ViewSourceSidebar } from './ViewSource.js'
import { Sidebar as AddDeviceSidebar } from './AddDevice.js'
import { SidebarNav } from './SidebarNav.js'

import './Sidebar.css'

export const Sidebar = () => (
	<>
		<SidebarNav />
		<WIPSidebar />
		<DeviceSidebar />
		<SearchSidebar />
		<ViewSourceSidebar />
		<AddDeviceSidebar />
	</>
)

export const SidebarContent = (
	props: ParentProps<{ class?: string; id: string }>,
) => (
	<aside class={`sidebar ${props.class ?? ''}`} id={props.id}>
		{props.children}
	</aside>
)

export const SearchButton = () => {
	const location = useNavigation()
	const hasSearch = () => location.current().search.length > 0

	return (
		<>
			<Show
				when={location.current().panel === 'search'}
				fallback={
					<a class="button" href={location.link({ panel: 'search' })}>
						<SearchButtonState hasSearch={hasSearch()} />
					</a>
				}
			>
				<a class="button active" href={location.linkToHome()}>
					<SearchButtonState hasSearch={hasSearch()} />
				</a>
			</Show>
			<hr />
		</>
	)
}

const SearchButtonState = (props: { hasSearch: boolean }) => (
	<Show when={props.hasSearch} fallback={<Search strokeWidth={2} />}>
		<ActiveSearch class="highlight" strokeWidth={2} />
	</Show>
)

export const WarningButton = () => {
	const location = useNavigation()

	return (
		<>
			<Show
				when={location.current().panel === 'warning'}
				fallback={
					<a
						class="button warning"
						href={location.link({ panel: 'warning' })}
						title="Warning: Under construction!"
					>
						<Warning strokeWidth={2} />
					</a>
				}
			>
				<a
					class="button warning active"
					href={location.linkToHome()}
					title="Warning: Under construction!"
				>
					<Warning strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}
