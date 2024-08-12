import { useNavigation } from '#context/Navigation.js'
import { ActiveSearch, Search } from '#icons/LucideIcon.js'
import { Show } from 'solid-js'

export const SearchButton = () => {
	const location = useNavigation()
	const hasSearch = () => location.current().search.length > 0

	return (
		<>
			<Show
				when={location.current().panel === 'search'}
				fallback={
					<a class="button" href={location.link({ panel: 'search' })}>
						<SearchButtonState hasSearch={hasSearch()} />
					</a>
				}
			>
				<a class="button active" href={location.linkToHome()}>
					<SearchButtonState hasSearch={hasSearch()} />
				</a>
			</Show>
			<hr />
		</>
	)
}
const SearchButtonState = (props: { hasSearch: boolean }) => (
	<Show when={props.hasSearch} fallback={<Search strokeWidth={2} />}>
		<ActiveSearch class="highlight" strokeWidth={2} />
	</Show>
)
