import { useNavigation } from '#context/Navigation.js'
import { Collapse, Expand } from '#icons/LucideIcon.js'
import { Show } from 'solid-js'

export const ToggleButton = (props: { id: string; title: string }) => {
	const nav = useNavigation()
	return (
		<Show
			when={nav.isToggled(props.id)}
			fallback={
				<button
					type="button"
					aria-expanded={false}
					onClick={() => nav.toggle(props.id)}
					title={`Show ${props.title}`}
				>
					<Expand size={20} strokeWidth={1} />
				</button>
			}
		>
			<button
				type="button"
				aria-expanded={true}
				onClick={() => nav.toggle(props.id)}
				title={`Hide ${props.title}`}
			>
				<Collapse size={20} strokeWidth={1} />
			</button>
		</Show>
	)
}
