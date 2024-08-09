import { useNavigation } from '#context/Navigation.js'
import { Show, type JSX, type ParentProps } from 'solid-js'
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
