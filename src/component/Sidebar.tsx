import { Show, type ParentProps } from 'solid-js'
import { useNavigation } from '../context/Navigation.js'
import { link } from '../util/link.js'
import { Close, Warning } from './LucideIcon.js'
import './Sidebar.css'

export const Sidebar = () => {
	const location = useNavigation()

	return (
		<>
			<SidebarNav />
			<Show when={location() === 'warning'}>
				<SidebarContent class="warning">
					<header>
						<h1>Under construction!</h1>
					</header>
					<nav>
						<span></span>
						<a href={link('/#')} class="close">
							<Close size={20} />
						</a>
					</nav>
					<div style={{ padding: '1rem' }}>
						<p>
							This website is under construction and not intended for production
							use.
						</p>
					</div>
				</SidebarContent>
			</Show>
		</>
	)
}

const SidebarContent = (props: ParentProps<{ class?: string }>) => (
	<aside class={`sidebar ${props.class ?? ''}`}>{props.children}</aside>
)

const SidebarNav = () => (
	<nav class="sidebar">
		<a href={link('/#')} class="button white">
			<img
				src={link('/assets/logo.svg')}
				class="logo"
				alt="hello.nrfcloud.com logo"
			/>
		</a>
		<hr />
		<a class="button warning" href={link('/#warning')}>
			<Warning strokeWidth={2} size={32} />
		</a>
	</nav>
)
