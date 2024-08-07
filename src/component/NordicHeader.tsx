import { useViteEnv } from '#context/ViteEnv.js'

import './NordicHeader.css'

export const NordicHeader = () => {
	const { baseNoEndSlash } = useViteEnv()
	return (
		<header class="nordic">
			<img
				src={`${baseNoEndSlash}/assets/nordicsemi-logo.svg`}
				alt="Nordic Semiconductor Logo"
				class="logo"
			/>
			<img
				src={`${baseNoEndSlash}/assets/nordicsemi-text.svg`}
				alt="Nordic Semiconductor"
				class="text"
			/>
		</header>
	)
}
