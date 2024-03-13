import { Show } from 'solid-js'
import { useNavigation } from '../context/Navigation.js'
import { Collapse, Expand } from '../icons/LucideIcon.js'

export const ToggleButton = (props: { id: string }) => {
	const nav = useNavigation()
	return (
		<Show
			when={nav.isToggled(props.id)}
			fallback={
				<button
					type="button"
					aria-expanded={false}
					onClick={() => nav.toggle(props.id)}
				>
					<Expand size={20} strokeWidth={1} />
				</button>
			}
		>
			<button
				type="button"
				aria-expanded={true}
				onClick={() => nav.toggle(props.id)}
			>
				<Collapse size={20} strokeWidth={1} />
			</button>
		</Show>
	)
}
