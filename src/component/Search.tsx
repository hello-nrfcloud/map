import { For, Show, createMemo } from 'solid-js'
import { useDevices } from '../context/Devices.js'
import { type Device } from '../resources/fetchDevices.js'
import { useNavigation } from '../context/Navigation.js'
import {
	type SearchTerm,
	matches,
	SearchTermType,
	isSearchTermType,
} from '../search.ts'
import { Device as DeviceIcon } from '../icons/Device.js'
import { AddToSearch, Close, Published } from '../icons/LucideIcon.js'
import { RelativeTime } from './RelativeTime.js'
import { SidebarContent } from './Sidebar.js'

import './Search.css'
import { noop } from '../util/noop.js'

const parse = (value: string): SearchTerm | undefined => {
	const [type, term] = value.trim().split(':')
	if (type !== undefined && term === undefined) {
		return { type: SearchTermType.Any, term: type }
	} else if (isSearchTermType(type) && term !== undefined) {
		return { type, term } as SearchTerm
	}
	return undefined
}

const Search = () => {
	let input!: HTMLInputElement
	const location = useNavigation()

	const addTerm = () => {
		if (input.value.length === 0) return
		const maybeTerm = parse(input.value)
		if (maybeTerm !== undefined) {
			location.navigateWithSearchTerm(maybeTerm)
			input.value = ''
		} else {
			// TODO: show error
			console.error(`Invalid search term: ${input.value}`)
		}
	}

	return (
		<>
			<div class="boxed pad wrapper bg-light">
				<div>
					<form onSubmit={noop}>
						<label for="search">Enter your search term:</label>
						<div class="input-group">
							<input
								id="search"
								type="search"
								placeholder='e.g. "id:<device id>"'
								ref={input}
								onKeyUp={(e) => {
									if (e.key === 'Enter') {
										addTerm()
									}
								}}
							/>
							<button
								type="button"
								class="btn"
								onClick={() => {
									addTerm()
								}}
							>
								<AddToSearch size={20} />
							</button>
						</div>
					</form>
					<Show when={location.current().search.length > 0}>
						<div class="terms">
							<For each={location.current().search}>
								{(term) => (
									<a class="btn" href={location.linkWithoutSearchTerm(term)}>
										<span>{term.type}:</span>
										<span>{term.term}</span>
										<Close size={20} />
									</a>
								)}
							</For>
						</div>
					</Show>
				</div>
			</div>
			<Show
				when={location.current().search.length > 0}
				fallback={<MostRecentDevicesList />}
			>
				<SearchResult terms={location.current().search} />
			</Show>
		</>
	)
}

export const Sidebar = () => {
	const devices = useDevices()
	const numDevices = createMemo(() => devices().length)
	const location = useNavigation()

	return (
		<Show when={location.current().panel === 'search'}>
			<SidebarContent class="search" id="search">
				<header>
					<h1>Search {numDevices()} devices</h1>
					<a href={location.linkToHome()} class="close">
						<Close size={20} />
					</a>
				</header>
				<div class="scrollable">
					<Search />
				</div>
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
			<div class="boxed">
				<For each={results()} fallback={<p>No matching devices found.</p>}>
					{(device) => <DeviceCard device={device} />}
				</For>
			</div>
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
			<div class="boxed pad">
				<For
					each={devices().slice(0, 10)}
					fallback={<p>No matching devices found.</p>}
				>
					{(device) => <DeviceCard device={device} />}
				</For>
			</div>
		</section>
	)
}

const DeviceCard = (props: { device: Device }) => {
	const location = useNavigation()
	return (
		<div class="result pad">
			<span>
				<DeviceIcon class="icon" />
			</span>
			<span>
				<a href={location.link({ panel: `id:${props.device.id}` })}>
					<code>{props.device.id}</code>
				</a>
				<br />
				<small>{props.device.model}</small>
				<small> &middot; </small>
				<Show
					when={props.device.lastUpdate !== undefined}
					fallback={<small>Never updated.</small>}
				>
					<small>
						<RelativeTime time={props.device.lastUpdate!}>
							<Published strokeWidth={1} size={16} />
						</RelativeTime>
					</small>
				</Show>
			</span>
		</div>
	)
}
