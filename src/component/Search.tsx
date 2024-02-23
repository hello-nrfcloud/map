import { type Device, useDevices } from '../context/Devices.js'
import './Search.css'
import { AddToSearch, Close, Updated } from './LucideIcon.js'
import { createSignal, For, Show, createEffect } from 'solid-js'
import { SidebarContent } from './Sidebar.jsx'
import { linkToDevice, linkToHome } from '../util/link.js'
import { Device as DeviceIcon } from '../icons/Device.js'
import { useNavigation } from '../context/Navigation.jsx'
import { instanceTs } from '../util/instanceTs.js'
import { formatDistanceToNow } from 'date-fns'

enum SearchTermType {
	Id = 'id',
	Model = 'model',
}
type SearchTerm = {
	type: SearchTermType
	term: string
}
const allowedTypes = [SearchTermType.Id, SearchTermType.Model]

const isSearchTermType = (term: unknown): term is SearchTermType =>
	typeof term === 'string' && allowedTypes.includes((term ?? '') as any)

const Search = () => {
	const [searchTerms, setSearchTerms] = createSignal<SearchTerm[]>([
		{ type: SearchTermType.Id, term: 'pentacid-coxalgia-backheel' },
		{ type: SearchTermType.Model, term: 'PCA20035+solar' },
	])
	let input!: HTMLInputElement

	const addSearchTerm = () => {
		if (input.value.length > 0) {
			const [type, term] = input.value.split(':')
			if (isSearchTermType(type) && term !== undefined) {
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
					<input
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
			<Show when={searchTerms().length > 0}>
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
	const [results, setResults] = createSignal<
		{ device: Device; lastUpdate: Date | undefined }[]
	>([])
	const devices = useDevices()

	createEffect(() =>
		setResults(
			devices()
				.filter(matches(terms))
				.map((device) => ({ device, lastUpdate: updateTs(device) })),
		),
	)

	return (
		<section class="results">
			<header>
				<h2>Results</h2>
			</header>
			<For
				each={results().sort(mostRecentUpdateFirst)}
				fallback={<p>No matching devices found.</p>}
			>
				{({ device, lastUpdate }) => {
					return (
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
									when={lastUpdate !== undefined}
									fallback={<small>Never updated.</small>}
								>
									<small>
										<time dateTime={lastUpdate!.toISOString()}>
											<Updated size={12} strokeWidth={1} />
											{formatDistanceToNow(lastUpdate!, { addSuffix: true })}
										</time>
									</small>
								</Show>
							</span>
						</div>
					)
				}}
			</For>
		</section>
	)
}

const matches = (terms: SearchTerm[]) => (/*device: Device*/) =>
	terms.reduce((matches) => matches, true)

const mostRecentUpdateFirst = (
	{ lastUpdate: u1 }: { lastUpdate: Date | undefined },
	{ lastUpdate: u2 }: { lastUpdate: Date | undefined },
): number => {
	const d1Update = u1?.getTime() ?? Number.MIN_SAFE_INTEGER
	const d2Update = u2?.getTime() ?? Number.MIN_SAFE_INTEGER
	return d2Update - d1Update
}

const updateTs = (device: Device): Date | undefined =>
	(device.state ?? []).map(instanceTs).sort(desc)[0]

const desc = (d1: Date, d2: Date) => d2.getTime() - d1.getTime()
