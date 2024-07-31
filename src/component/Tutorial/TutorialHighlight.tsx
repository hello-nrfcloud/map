import { createEffect, createSignal, Show, onCleanup } from 'solid-js'
import type { TutorialEntryType } from '../../../tutorial/tutorialContentPlugin.ts'
import { useNavigation } from '../../context/Navigation.js'
import { ScrollDown } from '../../icons/LucideIcon.js'
import { isDone } from './isDone.ts'

import './TutorialHighlight.css'

type Box = {
	top: number
	left: number
	width: number
	height: number
}

export const TutorialHighlight = (props: {
	tutorial: TutorialEntryType
	parent: Element
}) => {
	const [box, setBox] = createSignal<Box>()
	const [highlight, setHighlight] = createSignal<Element>()
	const [needsPointer, setNeedsPointer] = createSignal(false)

	createEffect(() => {
		setHighlight(
			getHighlight(props.tutorial, useNavigation()).highlight ?? undefined,
		)
	})

	createEffect(() => {
		setBox(
			(() => {
				const t = getHighlight(props.tutorial, useNavigation())
				if (t === undefined) return
				if (t.highlight === null) return
				if (t.completed) return
				const targetBox = t.highlight.getBoundingClientRect()
				const parentBox = props.parent.getBoundingClientRect()
				return {
					top: targetBox.top - parentBox.top + props.parent.scrollTop,
					left: targetBox.left - parentBox.left,
					width: targetBox.width,
					height: targetBox.height,
				}
			})(),
		)
	})

	createEffect(() => {
		if (highlight() === undefined) return
		const obs = new IntersectionObserver(
			(entries) => {
				setNeedsPointer(!(entries[0]?.isIntersecting ?? false))
			},
			{
				root: props.parent,
			},
		)

		obs.observe(highlight()!)

		onCleanup(() => obs.disconnect())
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
			<Show when={needsPointer()}>
				<ScrollToMarker
					parent={props.parent}
					tutorial={props.tutorial}
					targetBox={box()!}
				/>
			</Show>
		</Show>
	)
}

export const ScrollToMarker = (props: {
	tutorial: TutorialEntryType
	parent: Element
	targetBox: Box
}) => {
	const size = 64
	const [top, setTop] = createSignal<number>()

	createEffect(() => {
		const parentBox = props.parent.getBoundingClientRect()
		if (
			parentBox.top + props.targetBox.top >
			document.documentElement.clientHeight
		) {
			setTop(document.documentElement.clientHeight - parentBox.top - size)
		} else {
			setTop(undefined)
		}
	})

	return (
		<Show when={top() !== undefined}>
			<div
				class="tutorial-scrolltomarker"
				style={{
					top: `${top()!}px`,
					left: `${props.targetBox.left + props.targetBox.width / 2 - size / 2}px`,
				}}
			>
				<ScrollDown size={64} />
			</div>
		</Show>
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
