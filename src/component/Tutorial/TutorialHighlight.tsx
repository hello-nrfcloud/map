import { content } from 'map:tutorial-content'
import { Show, createEffect, createSignal } from 'solid-js'
import { useNavigation } from '../../context/Navigation.tsx'
import { isDone } from './isDone.ts'

import './TutorialHighlight.css'

export const TutorialHighlight = () => {
	const location = useNavigation()
	const [highlight, setHighlight] = createSignal<DOMRect | undefined>()
	const what = () => location.current().tutorial

	const currentTutorial = () => {
		const currentTutorialId = what()
		if (currentTutorialId === undefined) return
		return content[currentTutorialId]
	}

	const completed = (): boolean => {
		const t = currentTutorial()
		return t !== undefined && isDone(t, location)
	}

	createEffect(() => {
		const highlight = currentTutorial()?.highlight
		if (highlight === undefined) {
			setHighlight(undefined)
			return
		}
		const selector = highlight.map((title) => `[title="${title}"]`).join(' ')
		setHighlight(document.querySelector(selector)?.getBoundingClientRect())
	})

	return (
		<Show
			when={
				currentTutorial() !== undefined &&
				!completed() &&
				highlight() !== undefined
			}
		>
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
