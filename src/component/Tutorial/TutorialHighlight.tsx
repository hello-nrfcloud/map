import { type ParentProps, Show, createEffect, createSignal } from 'solid-js'
import type { TutorialEntryType } from '../../../tutorial/tutorialContentPlugin.ts'
import { useNavigation } from '../../context/Navigation.tsx'

import './TutorialHighlight.css'
import { isDone } from './isDone.tsx'

export const TutorialHighlight = (
	props: ParentProps<{
		tutorial: TutorialEntryType
	}>,
) => {
	const location = useNavigation()
	const [highlight, setHighlight] = createSignal<DOMRect | undefined>()

	const completed = (): boolean => isDone(props.tutorial, location)

	createEffect(() => {
		const highlight = props.tutorial.highlight
		if (highlight === undefined) {
			setHighlight(undefined)
			return
		}
		const selector = highlight.map((title) => `[title="${title}"]`).join(' ')
		const el = document.querySelector(selector)
		console.log(selector, el)
		setHighlight(el?.getBoundingClientRect() ?? undefined)
	})

	return (
		<Show when={!completed() && highlight() !== undefined}>
			<div
				id="tutorial-highlight"
				style={{
					top: highlight()!.top - 5 + 'px',
					left: highlight()!.left - 5 + 'px',
					width: highlight()!.width + 10 + 'px',
					height: highlight()!.height + 10 + 'px',
				}}
			></div>
		</Show>
	)
}
