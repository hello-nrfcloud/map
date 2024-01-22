import { Devices } from './component/Devices.jsx'
import { ExperimentalWarning } from './component/ExperimentalWarning.jsx'
import { Sidebar } from './component/Sidebar.jsx'

import './MapApp.css'

export const MapApp = () => {
	return (
		<>
			<Sidebar />
			<ExperimentalWarning />
			<main>
				<Devices />
			</main>
		</>
	)
}
