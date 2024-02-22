import { useNavigation } from '../context/Navigation.js'
import { linkToHome, linkToPanel } from '../util/link.js'
import { Close, ViewSource } from './LucideIcon.js'
import { SidebarContent } from './Sidebar.js'
import { Show } from 'solid-js'

const panelId = 'view-source'

export const Sidebar = () => {
	const location = useNavigation()
	return (
		<Show when={location().panel === panelId}>
			<SidebarContent>
				<header>
					<h1>View source</h1>
					<a href={linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<section class="separator">
					<p>
						The owners of the devices on this map have opted in to make the
						device data publicly available.
					</p>
					<p>
						Data published by the device to nRF Cloud will be visible to
						everyone if it follows the{' '}
						<a
							href="https://github.com/hello-nrfcloud/proto-lwm2m"
							target="_blank"
							rel="noopener noreferrer"
						>
							LwM2M object definitions
						</a>{' '}
						for this project. This allows anyone to describe the data their
						device is sending and for the map application interpret arbitrary
						device information. Certain objects (for example location,
						environment) will have additional UI features, which can be re-used
						for all devices that fulfill the object definition.
					</p>
					<p>
						This only works if the device connects to nRF Cloud using the{' '}
						<code>hello.nrfcloud.com</code> credentials.
					</p>
					<p>
						Follow <a href={linkToPanel('add-device')}>these instructions</a> to
						add your own device.
					</p>
					<p>
						The source-code for this project can be found on{' '}
						<a class="button" href={REPOSITORY_URL} target="_blank">
							GitHub
						</a>
						.
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
						<ViewSource strokeWidth={2} />
					</a>
				}
			>
				<a class="button active" href={linkToHome()}>
					<ViewSource strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}
