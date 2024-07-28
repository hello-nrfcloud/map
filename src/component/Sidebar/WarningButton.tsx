import { Show } from 'solid-js'
import { useNavigation } from '../../context/Navigation.tsx'
import { Warning } from '../../icons/LucideIcon.tsx'

export const WarningButton = () => {
	const location = useNavigation()

	return (
		<>
			<Show
				when={location.current().panel === 'warning'}
				fallback={
					<a
						class="button warning"
						href={location.link({ panel: 'warning' })}
						title="Warning: Under construction!"
					>
						<Warning strokeWidth={2} />
					</a>
				}
			>
				<a
					class="button warning active"
					href={location.linkToHome()}
					title="Warning: Under construction!"
				>
					<Warning strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}
