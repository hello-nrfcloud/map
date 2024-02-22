import { useNavigation } from '../context/Navigation.js'
import { linkToHome } from '../util/link.js'
import { Close } from './LucideIcon.js'
import { SidebarContent } from './Sidebar.js'
import { Show } from 'solid-js'

export const WIPSidebar = () => {
	const location = useNavigation()
	return (
		<Show when={location().panel === 'warning'}>
			<SidebarContent class="warning">
				<header>
					<h1>Under construction!</h1>
					<a href={linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<hr />
				<div style={{ padding: '1rem' }}>
					<p>
						This website is under construction and not intended for production
						use.
					</p>
				</div>
			</SidebarContent>
		</Show>
	)
}
