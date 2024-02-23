import { useNavigation } from '../context/Navigation.js'
import { linkToHome, linkToPanel } from '../util/link.js'
import { Close, Add } from '../icons/LucideIcon.jsx'
import { SidebarContent } from './Sidebar.js'
import { Show } from 'solid-js'

const panelId = 'add-device'

export const Sidebar = () => {
	const location = useNavigation()
	return (
		<Show when={location().panel === panelId}>
			<SidebarContent>
				<header>
					<h1>Add your device</h1>
					<a href={linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<section class="separator">
					<p>
						Instructions for adding your device to this application will follow,
						soon.
					</p>
				</section>
			</SidebarContent>
		</Show>
	)
}

export const SidebarButton = () => {
	const location = useNavigation()

	return (
		<>
			<Show
				when={location().panel === panelId}
				fallback={
					<a class="button" href={linkToPanel(panelId)}>
						<Add strokeWidth={2} />
					</a>
				}
			>
				<a class="button active" href={linkToHome()}>
					<Add strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}
