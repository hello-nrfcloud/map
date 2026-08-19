import { useNavigation } from '#context/Navigation.tsx'
import { Dashboard } from '#icons/LucideIcon.tsx'

export const SidebarButton = () => {
	const location = useNavigation()

	return (
		<>
			<a
				class="button"
				href={location.linkToPage('dashboard')}
				title="Manage your public devices"
			>
				<Dashboard strokeWidth={2} />
			</a>
			<hr />
		</>
	)
}
