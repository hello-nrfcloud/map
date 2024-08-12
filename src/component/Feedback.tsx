import { useNavigation } from '#context/Navigation.js'
import { Close, Feedback } from '#icons/LucideIcon.js'
import { Show } from 'solid-js'
import { SidebarContent } from './Sidebar/SidebarContent.js'

const panelId = 'feedback'

export const Sidebar = () => {
	const location = useNavigation()
	return (
		<Show when={location.current().panel === panelId}>
			<SidebarContent id={panelId}>
				<header>
					<h1>We'd love to hear your feedback!</h1>
					<a href={location.linkToHome()} class="close" title="Close">
						<Close size={20} />
					</a>
				</header>
				<div class="scrollable">
					<section class="separator">
						<p>
							If you have feedback or comments, please do not hesitate to share
							them with us.
						</p>
						<p>
							Please use our{' '}
							<a
								href="https://hello.nrfcloud.com/feedback/"
								target="_blank"
								rel="noopener noreferrer"
							>
								feedback form
							</a>
							!
						</p>
					</section>
				</div>
			</SidebarContent>
		</Show>
	)
}

export const SidebarButton = () => {
	const location = useNavigation()

	return (
		<>
			<Show
				when={location.current().panel === panelId}
				fallback={
					<a
						class="button"
						href={location.link({ panel: panelId })}
						title="Feedback"
					>
						<Feedback strokeWidth={2} />
					</a>
				}
			>
				<a class="button active" href={location.linkToHome()} title="Feedback">
					<Feedback strokeWidth={2} />
				</a>
			</Show>
			<hr />
		</>
	)
}
