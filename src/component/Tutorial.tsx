import { Add, Close, Menu, Next, PinOnMap } from '../icons/LucideIcon.js'
import { Show, type ParentProps, type JSX } from 'solid-js'
import { useNavigation } from '../context/Navigation.jsx'
import {
	Tutorial as TutorialIcon,
	History as HistoryIcon,
} from '../icons/LucideIcon.js'
import { useAllDevicesMapState } from '../context/AllDeviceMapState.jsx'
import { Expand } from '../icons/LucideIcon.jsx'

import './Tutorial.css'
import { SearchTermType } from '../context/Search.js'
import { ModelID } from '@hello.nrfcloud.com/proto-lwm2m'

export const Tutorial = () => {
	const location = useNavigation()
	const { update: updateMapState } = useAllDevicesMapState()

	return (
		<>
			<Box
				dialogue
				id="start"
				title={
					<h1>
						Welcome to <code>hello.nrfcloud.com/map</code>
					</h1>
				}
			>
				<p>
					Boxes like this one will walk you through this application and help
					you familiarize yourself with its features.
				</p>
				<p>
					<a href={location.link({ help: 'map' })}>Let's get started!</a>
				</p>
			</Box>
			<Box
				dialogue
				id="map"
				title={
					<h1>
						The map shows cellular IoT devices powered by Nordic Semiconductor
						hardware
					</h1>
				}
			>
				<p>
					Most of these devices are owned and operated by our customers to
					demonstrate their diverse applications and capabilities to a global
					audience.
				</p>
				<p>
					<button
						type="button"
						class="link"
						onClick={() => {
							updateMapState({
								center: { lat: 63.421388236785305, lng: 10.437750381503179 },
								zoom: 18,
								apply: true,
							})
							location.navigate({
								help: 'map-select',
								map: {
									center: {
										lat: 63.421388236785305,
										lng: 10.437750381503179,
									},
									zoom: 18,
								},
							})
						}}
					>
						Let's zoom to our headquarter to inspect some of the devices more
						closely.
					</button>
				</p>
			</Box>
			<Box dialogue id="map-select" title={<h1>Select a device</h1>}>
				<p>Click on the circles to view the data the devices have reported.</p>
				<p>
					Let's look at the device{' '}
					<a
						href={location.link({
							panel: `id:pentacid-coxalgia-backheel`,
							help: 'other-objects',
						})}
					>
						<code>pentacid-coxalgia-backheel</code>
					</a>
					.
				</p>
			</Box>
			<Box
				dialogue
				id="custom-devices"
				title={<h1>Custom devices</h1>}
				next="custom-map"
			>
				<p>We make it very easy to add your own custom device.</p>
				<p>
					All it takes is to register a custom device type in{' '}
					<a
						href="https://github.com/hello-nrfcloud/proto-lwm2m/tree/saga/models"
						target="_blank"
					>
						our protocol repository
					</a>
					.
				</p>
				<p>
					Here is an example: the model <code>kartverket-vasstandsdata</code>{' '}
					provides sea water levels.
				</p>
				<p>
					<a
						href={location.link({
							panel: 'search',
							search: [
								{
									type: SearchTermType.Model,
									term: 'kartverket-vasstandsdata',
								},
							],
						})}
					>
						Use the search to show only the devices with this type
					</a>
					.
				</p>
				<p>Now, select one of the devices.</p>
			</Box>
			<Box
				dialogue
				id="custom-map"
				title={<h1>Customize the map</h1>}
				next="add-device"
			>
				<p>
					Using the resources from <em>Sea Water Level</em> you can show both
					the station code and the level on the map.
				</p>
				<p>
					This allows you to create a show-case map only for your custom
					devices.
				</p>
				<p>
					<a
						href={location.link({
							panel: 'world',
							map: {
								zoom: 4,
								center: {
									lat: 65.18092273234197,
									lng: 20.590049136261882,
								},
							},
							resources: [
								{
									model: ModelID.Kartverket_vasstandsdata,
									ObjectID: 14230,
									ResourceID: 0,
								},
								{
									model: ModelID.Kartverket_vasstandsdata,
									ObjectID: 14230,
									ResourceID: 1,
								},
							],
						})}
					>
						Here is an example
					</a>
					.
				</p>
				<p>
					You can share a customized map view (including the map view) always
					using the current URL.
				</p>
			</Box>
			<Box dialogue id="add-device" title={<h1>Add your device</h1>}>
				<p>
					To acquire credentials for your devices to publish data, click the{' '}
					<Add strokeWidth={1} size={16} /> icon in the sidebar.
				</p>
				<p>
					<a href={location.link({ panel: 'add-device', help: undefined })}>
						Add your device.
					</a>
				</p>
			</Box>
		</>
	)
}

export const SidebarButton = () => {
	const location = useNavigation()

	return (
		<>
			<a class="button" href={location.link({ help: 'start' })}>
				<TutorialIcon strokeWidth={2} />
			</a>
			<hr />
		</>
	)
}

export const Box = (
	props: ParentProps<{
		title: JSX.Element
		id: string
		dialogue?: boolean
		next?: string
	}>,
) => {
	const location = useNavigation()
	const what = () => location.current().help
	return (
		<Show when={what() === props.id}>
			<aside class={`tutorial ${props.dialogue ?? false ? 'dialogue' : ''}`}>
				<header>
					{props.title}
					<button
						type="button"
						onClick={() =>
							location.navigate({
								help: undefined,
							})
						}
					>
						<Close />
					</button>
				</header>
				<section>{props.children}</section>
				<Show when={props.next !== undefined}>
					<footer>
						<button
							type="button"
							onClick={() =>
								location.navigate({
									help: props.next,
								})
							}
						>
							<Next />
						</button>
					</footer>
				</Show>
			</aside>
		</Show>
	)
}

export const WellKnown = () => (
	<Box
		id="well-known-objects"
		title={<h1>Well known objects</h1>}
		next="history"
	>
		<p>
			For some objects we provide dedicated UI elements. Click on the location
			tab above to see one.
		</p>
	</Box>
)

export const OtherObjects = () => (
	<Box
		id="other-objects"
		title={<h1>Devices send LwM2M</h1>}
		next="show-data-on-map"
	>
		<p>
			All device data is described using LwM2M objects, which have been
			registered in{' '}
			<a href="https://github.com/hello-nrfcloud/proto-lwm2m" target="_blank">
				our LwM2M registry
			</a>
			.
		</p>
		<p>
			This allows us to display arbitrary device data in a user-friendly way,
			with detail explanation of each value.
		</p>
		<p>
			Click on the <Expand strokeWidth={1} size={16} /> icon of{' '}
			<em>Environment</em> to explore the data this device has sent.
		</p>
	</Box>
)

export const ShowDataOnMap = () => (
	<Box
		id="show-data-on-map"
		title={<h1>Show this data on the Map</h1>}
		next="pinned"
	>
		<p>
			All data can be shown on the map. Select the{' '}
			<Menu strokeWidth={1} size={16} /> next to <em>Temperature</em> to show
			the context menu.
		</p>
		<p>
			Then click on <PinOnMap strokeWidth={1} size={16} /> to show the data on
			the map.
		</p>
		<p>You can show multiple values on the map.</p>
	</Box>
)

export const Pinned = () => (
	<Box id="pinned" title={<h1>Pinned data</h1>} next="well-known-objects">
		<p>
			Resources that you have selected are shown in the <em>Pinned</em> tab
			above.
		</p>
	</Box>
)

export const History = () => (
	<Box id="history" title={<h1>History</h1>} next="custom-devices">
		<p>We provide a 30 day history for all numerical values.</p>
		<p>
			Expand the <em>Environment</em> object below again.
		</p>
		<p>
			Select the <Menu strokeWidth={1} size={16} /> next to{' '}
			<em>Temperature value</em> to show the context menu.
		</p>
		<p>
			Then click on <HistoryIcon strokeWidth={1} size={16} /> to show a history
			chart for this resource.
		</p>
	</Box>
)

export const TutorialBoxes = () => (
	<>
		<OtherObjects />
		<ShowDataOnMap />
		<Pinned />
		<WellKnown />
		<History />
	</>
)
