import { content } from 'map:tutorial-content'
import { For, Show, createEffect } from 'solid-js'
import { useNavigation } from '../../context/Navigation.tsx'
import { Tutorial as TutorialIcon } from '../../icons/LucideIcon.tsx'
import { TutorialBox } from './TutorialBox.tsx'
import { TutorialHighlight } from './TutorialHighlight.tsx'

export const SidebarButton = () => {
	const location = useNavigation()

	return (
		<>
			<a class="button" href={location.link({ tutorial: 'start' })}>
				<TutorialIcon strokeWidth={2} />
			</a>
			<hr />
		</>
	)
}

export const Tutorial = () => {
	const location = useNavigation()
	const what = () => location.current().tutorial

	const currentTutorial = () => {
		const currentTutorialId = what()
		if (currentTutorialId === undefined) return
		return content[currentTutorialId]
	}

	createEffect(() => {
		const root = document.getElementById('root')

		if (root === null) return
		const className = root.className.replaceAll('with-tutorial', '').trim()
		if (what() === undefined) {
			root.className = className
		} else {
			root.className = className + ' with-tutorial'
		}
	})

	return (
		<>
			<Show when={currentTutorial() !== undefined}>
				<TutorialHighlight tutorial={currentTutorial()!} />
			</Show>
			<For each={Object.entries(content)}>
				{([id, content]) => (
					<Show when={what() === id}>
						<TutorialBox tutorial={content} />
					</Show>
				)}
			</For>
		</>
	)
}
