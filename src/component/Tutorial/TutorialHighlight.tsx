import { useNavigation } from '../../context/Navigation.tsx'
import { isDone } from './isDone.ts'
import { ScrollDown } from '../../icons/LucideIcon.tsx'
import type { TutorialEntryType } from '../../../tutorial/tutorialContentPlugin.ts'
import { createSignal, createEffect, Show } from 'solid-js'

import './TutorialHighlight.css'

export const TutorialHighlight = (props: {
	tutorial: TutorialEntryType
	parent: Element
}) => {
	const [box, setBox] = createSignal<{
		top: number
		left: number
		width: number
		height: number
	}>()

	createEffect(() => {
		const t = getHighlight(props.tutorial, useNavigation())
		if (t === undefined) return
		if (t.highlight === null) return
		if (t.completed) return
		const targetBox = t.highlight.getBoundingClientRect()
		const parentBox = props.parent.getBoundingClientRect()
		setBox({
			top: targetBox.top - parentBox.top,
			left: targetBox.left - parentBox.left,
			width: targetBox.width,
			height: targetBox.height,
		})
	})

	return (
		<Show when={box() !== undefined}>
			<div
				class="tutorial-highlight"
				style={{
					top: box()!.top - 5 + 'px',
					left: box()!.left - 5 + 'px',
					width: box()!.width + 10 + 'px',
					height: box()!.height + 10 + 'px',
				}}
			></div>
		</Show>
	)
}

export const ScrollToMarker = (props: {
	tutorial: TutorialEntryType
	parent: Element
}) => {
	const t = getHighlight(props.tutorial, useNavigation())
	if (t === undefined) return null
	if (t.highlight === null) return null
	if (t.completed) return null

	const hl = t.highlight.getBoundingClientRect()
	if (hl.top < document.documentElement.getBoundingClientRect().bottom)
		return null
	const center = hl.left + hl.width / 2

	return (
		<div
			class="tutorial-scrolltomarker"
			style={{
				top:
					document.documentElement.getBoundingClientRect().bottom - 64 + 'px',
				left: center - 64 / 2 + 'px',
			}}
		>
			<ScrollDown size={64} />
		</div>
	)
}

const getHighlight = (
	tutorial: TutorialEntryType,
	location: ReturnType<typeof useNavigation>,
): { completed: boolean; highlight: Element | null } => {
	return {
		completed: isDone(tutorial, location),
		highlight:
			tutorial.highlight !== undefined
				? document.querySelector(
						tutorial.highlight.map((title) => `[title="${title}"]`).join(' '),
					)
				: null,
	}
}
