import { For, Show, createMemo } from 'solid-js'
import { useDevices, type Device } from '../context/Devices.js'
import { useNavigation } from '../context/Navigation.jsx'
import { useSearch, type SearchTerm, matches } from '../context/Search.jsx'
import { Device as DeviceIcon } from '../icons/Device.js'
import { AddToSearch, Close } from '../icons/LucideIcon.jsx'
import { linkToDevice, linkToHome } from '../util/link.js'
import { RelativeTime } from './RelativeTime.jsx'
import './Search.css'
import { SidebarContent } from './Sidebar.jsx'

const Search = () => {
	const search = useSearch()
	let input!: HTMLInputElement

	return (
		<>
			<div class="wrapper boxed light">
				<form
					onSubmit={(e) => {
						e.preventDefault()
						e.stopPropagation()
					}}
				>
					<label for="search">Enter your search term:</label>
					<div class="input-group">
						<input
							id="search"
							type="search"
							placeholder='e.g. "id:<device id>"'
							ref={input}
							onKeyUp={(e) => {
								if (e.key === 'Enter') {
									search.addSearchTerm(input.value)
									input.value = ''
								}
							}}
						/>
						<button type="button">
							<AddToSearch size={20} />
						</button>
					</div>
				</form>
				<Show when={search.searchTerms().length > 0}>
					<div class="terms">
						<For each={search.searchTerms()}>
							{(term) => (
								<button
									type="button"
									onClick={() => search.removeSearchTerm(term)}
								>
									<span>{term.type}:</span>
									<span>{term.term}</span>
									<Close size={16} />
								</button>
							)}
						</For>
					</div>
				</Show>
			</div>
			<Show
				when={search.searchTerms().length > 0}
				fallback={<MostRecentDevicesList />}
			>
				<SearchResult terms={search.searchTerms()} />
			</Show>
		</>
	)
}

export const Sidebar = () => {
	const devices = useDevices()
	const numDevices = createMemo(() => devices().length)
	const location = useNavigation()

	return (
		<Show when={location().panel === 'search'}>
			<SidebarContent class="search">
				<header>
					<h1>Search {numDevices()} devices</h1>
					<a href={linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<Search />
			</SidebarContent>
		</Show>
	)
}

const SearchResult = (props: { terms: SearchTerm[] }) => {
	const devices = useDevices()
	const results = createMemo(() => devices().filter(matches(props.terms)))

	return (
		<section class="results">
			<header>
				<h2>{results().length} results</h2>
			</header>
			<For each={results()} fallback={<p>No matching devices found.</p>}>
				{(device) => <DeviceCard device={device} />}
			</For>
		</section>
	)
}

const MostRecentDevicesList = () => {
	const devices = useDevices()

	return (
		<section class="results">
			<header>
				<h2>Recently updated devices</h2>
			</header>
			<For
				each={devices().slice(0, 10)}
				fallback={<p>No matching devices found.</p>}
			>
				{(device) => <DeviceCard device={device} />}
			</For>
		</section>
	)
}

const DeviceCard = (props: { device: Device }) => (
	<div class="result boxed">
		<DeviceIcon class="icon" />
		<span>
			<a href={linkToDevice(props.device.id)}>
				<code>{props.device.id}</code>
			</a>
			<br />
			<small>{props.device.model}</small>
			<br />
			<Show
				when={props.device.lastUpdate !== undefined}
				fallback={<small>Never updated.</small>}
			>
				<small>
					<RelativeTime time={props.device.lastUpdate!} />
				</small>
			</Show>
		</span>
	</div>
)
