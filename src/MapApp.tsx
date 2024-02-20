import { Devices } from './component/Devices.jsx'
import { Sidebar } from './component/Sidebar.jsx'

import './MapApp.css'

export const MapApp = () => {
	return (
		<>
			<Sidebar />
			<main>
				<Devices />
			</main>
		</>
	)
}
