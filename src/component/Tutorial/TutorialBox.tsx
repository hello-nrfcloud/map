import { type ParentProps, Show } from 'solid-js'
import { useNavigation } from '../../context/Navigation.tsx'
import { Close, Next, Prev } from '../../icons/LucideIcon.tsx'
import type { TutorialEntryType } from '../../../tutorial/tutorialContentPlugin.ts'
import { decode } from '../../context/navigation/encodeNavigation.ts'
import { useAllDevicesMapState } from '../../context/AllDeviceMapState.tsx'

import './TutorialBox.css'

export const TutorialBox = (
	props: ParentProps<{
		tutorial: TutorialEntryType
	}>,
) => {
	const location = useNavigation()
	const { update: updateMapState } = useAllDevicesMapState()
	const what = () => location.current().tutorial
	return (
		<Show when={what() === props.tutorial.id}>
			<aside class="tutorial dialogue">
				<header>
					<span>Tutorial</span>
					<button
						type="button"
						onClick={() =>
							location.navigate({
								tutorial: undefined,
							})
						}
					>
						<Close />
					</button>
				</header>
				<section
					innerHTML={props.tutorial.html}
					onClick={(ev) => {
						if (ev.target.tagName !== 'A') return
						const href = ev.target.getAttribute('href')
						if (!(href ?? '').startsWith('#')) return
						const state = decode(href!.slice(1))
						if (state === undefined) {
							console.error(
								'[Tutorial]',
								'Could not parse location from',
								href!,
							)
							return
						}
						ev.preventDefault()
						ev.stopPropagation()
						console.log('[Tutorial]', 'Clicked an internal link', {
							...state,
							tutorial: props.tutorial.id,
						})
						location.navigate({
							...state,
							tutorial: props.tutorial.id,
						})
						if ('map' in state && state.map !== undefined) {
							updateMapState({
								...state.map,
								apply: true,
							})
						}
					}}
				></section>
				<Show
					when={
						props.tutorial.prev !== undefined ||
						props.tutorial.next !== undefined
					}
				>
					<footer>
						<Show when={props.tutorial.prev !== undefined} fallback={<span />}>
							<button
								type="button"
								onClick={() =>
									location.navigate({
										tutorial: props.tutorial.prev!.id,
									})
								}
							>
								<Prev />
							</button>
						</Show>
						<Show when={props.tutorial.next !== undefined} fallback={<span />}>
							<button
								type="button"
								onClick={() =>
									location.navigate({
										tutorial: props.tutorial.next!.id,
									})
								}
							>
								<Next />
							</button>
						</Show>
					</footer>
				</Show>
			</aside>
		</Show>
	)
}
