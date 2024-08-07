import { Show } from 'solid-js'
import { useNavigation } from '#context/Navigation.js'
import { Add, Close } from '#icons/LucideIcon.js'
import { SidebarContent } from './Sidebar/SidebarContent.js'
import { ModelInfoBlock } from './ModelInfoBlock.js'

export const panelId = 'add-device'

export const Sidebar = () => {
	const location = useNavigation()
	return (
		<Show when={location.current().panel === panelId}>
			<SidebarContent class="add-device" id={panelId}>
				<header>
					<h1>Add your device</h1>
					<a href={location.linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<div class="scrollable">
					<section class="separator">
						<p>
							<code>hello.nrfcloud.com/map</code> is made to showcase real-world
							deployments of cellular IoT devices powered by Nordic
							Semiconductor hardware, demonstrating their diverse applications
							and capabilities to a global audience.
						</p>
						<p>
							We invite you to participate in this effort by adding your own
							devices to the map.
						</p>
						<p>
							All devices must use a well-known model definition. Below is a
							list of defined models.
						</p>
					</section>
					<section class="boxed pad-s pad-e">
						<ModelInfoBlock />
					</section>
					<section>
						<p>
							Get started by{' '}
							<a
								class="button"
								href={location.linkToPage('dashboard')}
								title="Dashboard"
							>
								logging in to the Dashboard
							</a>
							.
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
