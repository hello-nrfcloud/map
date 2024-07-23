import { useNavigation } from '../../context/Navigation.tsx'
import { Tutorial as TutorialIcon } from '../../icons/LucideIcon.tsx'
import { content } from 'map:tutorial-content'
import { Show, For } from 'solid-js'
import { TutorialBox } from './TutorialBox.tsx'

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
	return (
		<For each={Object.entries(content)}>
			{([id, content]) => (
				<Show when={what() === id}>
					<TutorialBox tutorial={content} />
				</Show>
			)}
		</For>
	)
}
