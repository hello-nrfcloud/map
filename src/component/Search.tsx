import { type Device, useDevices } from '../context/Devices.js'
import './Search.css'
import { AddToSearch, Close } from '../icons/LucideIcon.jsx'
import { createMemo, createSignal, For, Show, createEffect } from 'solid-js'
import { SidebarContent } from './Sidebar.jsx'
import { linkToDevice, linkToHome } from '../util/link.js'
import { Device as DeviceIcon } from '../icons/Device.js'
import { useNavigation } from '../context/Navigation.jsx'
import { RelativeTime } from './RelativeTime.jsx'

enum SearchTermType {
	Id = 'id',
	Model = 'model',
	NotModel = '-model',
	// Used to search for devices with LwM2M objects and resourcs
	Has = 'has',
	Any = '*',
}
type SearchTerm = {
	type: SearchTermType
	term: string
}
const allowedTypes = [
	SearchTermType.Id,
	SearchTermType.Model,
	SearchTermType.NotModel,
	SearchTermType.Has,
]

const isSearchTermType = (term: unknown): term is SearchTermType =>
	typeof term === 'string' && allowedTypes.includes((term ?? '') as any)

const Search = () => {
	const nav = useNavigation()
	const [searchTerms, setSearchTerms] = createSignal<SearchTerm[]>(
		[...nav().query.entries()].map<SearchTerm>(([k, v]) => ({
			type: k as SearchTermType,
			term: v,
		})),
	)
	let input!: HTMLInputElement

	const addSearchTerm = () => {
		if (input.value.length > 0) {
			const [type, term] = input.value.trim().split(':')
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

	// Update URL
	createEffect(() => {
		const s = new URLSearchParams(
			searchTerms().reduce(
				(terms, term) => ({ ...terms, [term.type]: term.term }),
				{},
			),
		).toString()
		document.location.hash = `search${s.length > 0 ? `?${s}` : ''}`
	})

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

const matches = (terms: SearchTerm[]) => (device: Device) =>
	terms.reduce((matches, term) => {
		if (matches === false) return false
		return termMatchesDevice(term, device)
	}, true)

const resourceValueSearchRx =
	/^(?<ObjectID>[0-9]+)\/(?<ResourceID>[0-9]+)=(?<Value>.+)/

const termMatchesDevice = (term: SearchTerm, device: Device) => {
	const tokens = []
	if (term.type === SearchTermType.NotModel)
		return !device.model.includes(term.term)
	if (term.type === SearchTermType.Id || term.type === SearchTermType.Any)
		tokens.push(device.id)
	if (term.type === SearchTermType.Model || term.type === SearchTermType.Any)
		tokens.push(device.model)
	if (term.type === SearchTermType.Has) {
		const maybeValueSearch = resourceValueSearchRx.exec(term.term)
		if (maybeValueSearch !== null) {
			tokens.push(
				...(device.state ?? [])
					.map(({ ObjectID, Resources }) =>
						Object.entries(Resources).map(
							([ResourceId, Value]) => `${ObjectID}/${ResourceId}=${Value}`,
						),
					)
					.flat(),
			)
		} else {
			const [ObjectID, ResourceId] = term.term.split('/')
			if (ResourceId === undefined) {
				tokens.push(device.state?.map(({ ObjectID }) => ObjectID))
			} else {
				tokens.push(
					...(device.state ?? [])
						.map(({ Resources }) =>
							Object.keys(Resources).map(
								(ResourceId) => `${ObjectID}/${ResourceId}`,
							),
						)
						.flat(),
				)
			}
		}
	}
	return tokens.join(' ').includes(term.term)
}
