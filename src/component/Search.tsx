import { useDevices } from '../context/Devices.js'
import './Search.css'
import { AddToSearch, Close } from './LucideIcon.js'
import { createSignal, For, Show } from 'solid-js'

export const Search = () => {
	const devices = useDevices()
	const [searchTerms, setSearchTerms] = createSignal<string[]>([
		`id:pentacid-coxalgia-backheel`,
		`model:PCA20035+solar`,
		`model:PCA20035+solar`,
		`model:PCA20035+solar`,
	])
	let input!: HTMLInputElement

	const addSearchTerm = () => {
		console.log({ value: input.value })
		if (input.value.length > 0) {
			setSearchTerms((prev) => [...prev, input.value])
		}
		input.value = ''
	}

	return (
		<aside class="search">
			<div class="wrapper">
				<div class="stats">{devices().length} devices</div>
				<div class="form-wrapper">
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
										{term}
										<Close size={16} />
									</button>
								)}
							</For>
						</div>
					</Show>
				</div>
			</div>
		</aside>
	)
}
