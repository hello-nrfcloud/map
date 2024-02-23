import { type Device, useDevices } from '../context/Devices.js'
import './Search.css'
import { AddToSearch, Close } from './LucideIcon.js'
import { createSignal, For, Show, createEffect } from 'solid-js'
import { SidebarContent } from './Sidebar.jsx'
import { linkToDevice, linkToHome } from '../util/link.js'
import { Device as DeviceIcon } from '../icons/Device.js'
import { useNavigation } from '../context/Navigation.jsx'
import { RelativeTime } from './RelativeTime.jsx'

enum SearchTermType {
	Id = 'id',
	Model = 'model',
	Any = '*',
}
type SearchTerm = {
	type: SearchTermType
	term: string
}
const allowedTypes = [SearchTermType.Id, SearchTermType.Model]

const isSearchTermType = (term: unknown): term is SearchTermType =>
	typeof term === 'string' && allowedTypes.includes((term ?? '') as any)

const Search = () => {
	const [searchTerms, setSearchTerms] = createSignal<SearchTerm[]>([])
	let input!: HTMLInputElement

	const addSearchTerm = () => {
		if (input.value.length > 0) {
			const [type, term] = input.value.split(':')
			if (type !== undefined && term === undefined) {
				setSearchTerms((prev) => [
					...prev,
					{ type: SearchTermType.Any, term: type },
				])
			} else if (isSearchTermType(type) && term !== undefined) {
				setSearchTerms((prev) => [...prev, { type, term } as SearchTerm])
			}
		}
		input.value = ''
	}

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
								if (e.key === 'Enter') addSearchTerm()
							}}
						/>
						<button type="button">
							<AddToSearch size={20} />
						</button>
					</div>
				</form>
				<Show when={searchTerms().length > 0}>
					<div class="terms">
						<For each={searchTerms()}>
							{(term) => (
								<button
									type="button"
									onClick={() =>
										setSearchTerms((terms) => terms.filter((t) => t !== term))
									}
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
				when={searchTerms().length > 0}
				fallback={<MostRecentDevicesList />}
			>
				<SearchResult terms={searchTerms()} />
			</Show>
		</>
	)
}

export const Sidebar = () => {
	const devices = useDevices()
	const [numDevices, setNumDevices] = createSignal<number>(0)
	createEffect(() => setNumDevices(devices().length))
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

const SearchResult = ({ terms }: { terms: SearchTerm[] }) => {
	const [results, setResults] = createSignal<Device[]>([])
	const devices = useDevices()

	createEffect(() => setResults(devices().filter(matches(terms))))

	return (
		<section class="results">
			<header>
				<h2>Results</h2>
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

const DeviceCard = ({ device }: { device: Device }) => (
	<div class="result boxed">
		<DeviceIcon class="icon" />
		<span>
			<a href={linkToDevice(device.id)}>
				<code>{device.id}</code>
			</a>
			<br />
			<small>{device.model}</small>
			<br />
			<Show
				when={device.lastUpdate !== undefined}
				fallback={<small>Never updated.</small>}
			>
				<small>
					<RelativeTime time={device.lastUpdate!} />
				</small>
			</Show>
		</span>
	</div>
)

const matches = (terms: SearchTerm[]) => (device: Device) =>
	terms.reduce((matches, term) => {
		if (matches === false) return false
		return termMatchesDevice(term, device)
	}, true)

const termMatchesDevice = (term: SearchTerm, device: Device) => {
	const tokens = []
	if (term.type === SearchTermType.Id || term.type === SearchTermType.Any)
		tokens.push(device.id)
	if (term.type === SearchTermType.Model || term.type === SearchTermType.Any)
		tokens.push(device.model)
	return tokens.join(' ').includes(term.term)
}
