import {
	type ParentProps,
	Show,
	createSignal,
	createEffect,
	onCleanup,
} from 'solid-js'
import type { TutorialEntryType } from '../../../tutorial/tutorialContentPlugin.js'
import { useAllDevicesMapState } from '#context/AllDeviceMapState.js'
import { useNavigation } from '#context/Navigation.js'
import { decode } from '#context/navigation/decodeNavigation.ts'
import { Close, Done, Next, Prev, ToDo } from '#icons/LucideIcon.js'
import { isDone } from './isDone.js'

import './TutorialBox.css'

export const TutorialBox = (
	props: ParentProps<{
		tutorial: TutorialEntryType
	}>,
) => {
	const [autoCompleted, setAutoCompleted] = createSignal(false)
	const location = useNavigation()
	const { update: updateMapState } = useAllDevicesMapState()
	const what = () => location.current().tutorial

	const hasDone = () => props.tutorial.done !== undefined

	const completed = (): boolean =>
		autoCompleted() || isDone(props.tutorial, location)

	// Automatically mark as done, if no done state is set
	createEffect(() => {
		if (hasDone()) return
		const t = setTimeout(() => {
			setAutoCompleted(true)
		}, 1500)
		onCleanup(() => {
			clearTimeout(t)
		})
	})

	return (
		<Show when={what() === props.tutorial.id}>
			<aside
				class={`tutorial ${completed() ? 'completed' : ''}`}
				title="Tutorial"
			>
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
						<span class="controls">
							<Show
								when={props.tutorial.prev !== undefined}
								fallback={<span />}
							>
								<button
									type="button"
									onClick={() =>
										location.navigate({
											tutorial: props.tutorial.prev,
										})
									}
									title="Previous"
								>
									<Prev />
								</button>
							</Show>
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
						</span>
						<span class="controls">
							<span>
								<Show when={completed()} fallback={<ToDo class="not-done" />}>
									<Done class="done" />
								</Show>
							</span>
							<Show
								when={props.tutorial.next !== undefined}
								fallback={<span />}
							>
								<button
									type="button"
									onClick={() =>
										location.navigate({
											tutorial: props.tutorial.next,
										})
									}
									title="Next"
								>
									<Next />
								</button>
							</Show>
						</span>
					</footer>
				</Show>
			</aside>
		</Show>
	)
}
