import { type ParentProps, Show } from 'solid-js'
import type { TutorialEntryType } from '../../../tutorial/tutorialContentPlugin.ts'
import { useAllDevicesMapState } from '../../context/AllDeviceMapState.tsx'
import { useNavigation } from '../../context/Navigation.tsx'
import { decode } from '../../context/navigation/encodeNavigation.ts'
import { Close, Done, Next, Prev, ToDo } from '../../icons/LucideIcon.tsx'

import './TutorialBox.css'
import { isDone } from './isDone.tsx'

export const TutorialBox = (
	props: ParentProps<{
		tutorial: TutorialEntryType
	}>,
) => {
	const location = useNavigation()
	const { update: updateMapState } = useAllDevicesMapState()
	const what = () => location.current().tutorial

	const hasDone = () => props.tutorial.done !== undefined

	const completed = (): boolean => isDone(props.tutorial, location)

	return (
		<Show when={what() === props.tutorial.id}>
			<aside class="tutorial dialogue">
				<header class={completed() ? 'completed' : ''}>
					<span>
						<Show when={hasDone()} fallback={<span>Tutorial</span>}>
							<Show when={completed()} fallback={<ToDo />}>
								<Done />
							</Show>
							<span class="pad-s">Tutorial</span>
						</Show>
					</span>
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
										tutorial: props.tutorial.prev,
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
										tutorial: props.tutorial.next,
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
