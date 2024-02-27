import { useNavigation } from '../context/Navigation.js'
import { Close, Add } from '../icons/LucideIcon.jsx'
import { SidebarContent } from './Sidebar.js'
import { Show } from 'solid-js'

const panelId = 'add-device'

export const Sidebar = () => {
	const location = useNavigation()
	return (
		<Show when={location.current().panel === panelId}>
			<SidebarContent>
				<header>
					<h1>Add your device</h1>
					<a href={location.linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<div class="scrollable">
					<section class="separator">
						<p>
							Instructions for adding your device to this application will
							follow, soon.
						</p>
					</section>
				</div>
			</SidebarContent>
		</Show>
	)
}

export const SidebarButton = () => {
	const location = useNavigation()

	return (
		<>
			<Show
				when={location.current().panel === panelId}
				fallback={
					<a class="button" href={location.link({ panel: panelId })}>
						<Add strokeWidth={2} />
					</a>
				}
			>
				<a class="button active" href={location.linkToHome()}>
					<Add strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}
