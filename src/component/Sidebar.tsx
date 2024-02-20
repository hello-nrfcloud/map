import './Sidebar.css'
import { createSignal, Show, onCleanup, type ParentProps } from 'solid-js'
import { Close, Warning } from './LucideIcon.js'

export const Sidebar = () => {
	const [location, setLocation] = createSignal(
		window.location.hash.slice(1) || 'home',
	)

	const locationHandler = () => setLocation(window.location.hash.slice(1))
	window.addEventListener('hashchange', locationHandler)

	onCleanup(() => window.removeEventListener('hashchange', locationHandler))

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
						<a href="/#" class="close">
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
		<a href="/#" class="button white">
			<img
				src="../assets/logo.svg"
				class="logo"
				alt="hello.nrfcloud.com logo"
			/>
		</a>
		<hr />
		<a class="button warning" href="/#warning">
			<Warning strokeWidth={2} size={32} />
		</a>
	</nav>
)
