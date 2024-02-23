import { useNavigation } from '../context/Navigation.js'
import { linkToHome } from '../util/link.js'
import { Close } from '../icons/LucideIcon.jsx'
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
				<section class="separator">
					<p>
						This website is under construction and not intended for production
						use.
					</p>
				</section>
			</SidebarContent>
		</Show>
	)
}
