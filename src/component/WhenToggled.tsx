import { Show, type ParentProps, type JSX } from 'solid-js'
import { useNavigation } from '../context/Navigation.js'
export const WhenToggled = (
	props: ParentProps<{ id: string; fallback?: JSX.Element }>,
) => {
	const toggled = () => useNavigation().current().toggled.includes(props.id)
	return (
		<Show when={toggled()} fallback={props.fallback}>
			{props.children}
		</Show>
	)
}
