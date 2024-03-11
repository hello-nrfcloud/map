import { useNavigation } from '../context/Navigation.js'
import { Close, ViewSource } from '../icons/LucideIcon.js'
import { RelativeTime } from './RelativeTime.js'
import { SidebarContent } from './Sidebar.js'
import { Show } from 'solid-js'

const panelId = 'view-source'

export const Sidebar = () => {
	const location = useNavigation()
	return (
		<Show when={location.current().panel === panelId}>
			<SidebarContent>
				<header>
					<h1>View source</h1>
					<a href={location.linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<div class="scrollable">
					<section class="separator">
						<p>
							<code>hello.nrfcloud.com/map</code> is a showcase that highlights
							Nordic Semiconductor's cellular IoT solutions by showing thousands
							of real connected devices, empowering customers to promote their
							solutions that make Nordic's ecosystem the best, and gathering
							valuable data to help future customer in their go-to-market
							efforts.
						</p>
						<p>
							Learn more about the project vision in{' '}
							<a
								href="https://github.com/hello-nrfcloud/map?tab=readme-ov-file"
								target="_blank"
							>
								the README
							</a>
							.
						</p>
						<p>
							The owners of the devices on this map have opted in to make the
							device data publicly available.
						</p>
						<p>
							Data published by the device to{' '}
							<a href="https://nrfcloud.com/" target="_blank">
								nRF Cloud
							</a>{' '}
							will be visible to everyone if it follows the{' '}
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
							environment) will have additional UI features, which can be
							re-used for all devices that fulfill the object definition.
						</p>
						<p>
							This only works if the device connects to nRF Cloud using the{' '}
							<code>hello.nrfcloud.com</code> credentials.
						</p>
						<p>
							Follow{' '}
							<a href={location.link({ panel: 'add-device' })}>
								these instructions
							</a>{' '}
							to add your own device.
						</p>
						<p>
							The source-code for this project can be found on{' '}
							<a class="button" href={REPOSITORY_URL} target="_blank">
								GitHub
							</a>
							.
						</p>
					</section>
					<footer>
						<p>Version: {VERSION}</p>
						<p>
							Build time: <RelativeTime time={new Date(BUILD_TIME)} />
						</p>
					</footer>
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
						<ViewSource strokeWidth={2} />
					</a>
				}
			>
				<a class="button active" href={location.linkToHome()}>
					<ViewSource strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}
