import './NordicHeader.css'

export const NordicHeader = () => (
	<header class="nordic">
		<img
			src={`${BASE_URL}/assets/nordicsemi-logo.svg`}
			alt="Nordic Semiconductor Logo"
			class="logo"
		/>
		<img
			src={`${BASE_URL}/assets/nordicsemi-text.svg`}
			alt="Nordic Semiconductor"
			class="text"
		/>
	</header>
)
