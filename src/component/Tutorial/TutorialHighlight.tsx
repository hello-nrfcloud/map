import { content } from 'map:tutorial-content'
import { Show, createEffect, createSignal, onCleanup } from 'solid-js'
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

		// Tutorial has no highlight
		if (highlight === undefined) {
			setHighlight(undefined)
			return
		}

		// Find the element to highlight
		const selector = highlight.map((title) => `[title="${title}"]`).join(' ')
		const target = document.querySelector(selector)

		// Highlight the element (or remove the highlight if the element is not found)
		const show = () => {
			setHighlight(target?.getBoundingClientRect())
		}
		show()

		if (target === null) return

		// Update the highlight position when the content changes based on user interaction
		const hide = () => {
			setHighlight(undefined)
		}

		const onComplete = (timeout: number) => {
			setTimeout(show, timeout)
		}
		const onTouchEnd = () => onComplete(1000)
		const onWheelEnd = () => {
			hide()
			onComplete(250)
		}
		document.addEventListener('touchstart', hide, { passive: true })
		document.addEventListener('touchend', onTouchEnd, { passive: true })
		document.addEventListener('wheel', onWheelEnd, { passive: true })

		onCleanup(() => {
			document.removeEventListener('touchstart', hide)
			document.removeEventListener('touchend', onTouchEnd)
			document.removeEventListener('wheel', onWheelEnd)
		})
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
