import { useNavigation } from '../context/Navigation.js'
import { Close } from '../icons/LucideIcon.js'
import { SidebarContent } from './Sidebar.js'
import { Show } from 'solid-js'

export const WIPSidebar = () => {
	const location = useNavigation()
	return (
		<Show when={location.current().panel === 'warning'}>
			<SidebarContent class="warning" id="warning">
				<header>
					<h1>Under construction!</h1>
					<a href={location.linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<div class="scrollable">
					<section class="separator">
						<p>
							This website is under construction and not intended for production
							use.
						</p>
					</section>
				</div>
			</SidebarContent>
		</Show>
	)
}
