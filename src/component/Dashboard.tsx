import { useNavigation } from '#context/Navigation.js'
import { Dashboard } from '#icons/LucideIcon.js'

export const SidebarButton = () => {
	const location = useNavigation()

	return (
		<>
			<a
				class="button"
				href={location.linkToPage('dashboard')}
				title="Dashboard"
			>
				<Dashboard strokeWidth={2} />
			</a>
			<hr />
		</>
	)
}
