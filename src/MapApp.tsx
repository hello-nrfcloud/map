import { AllDevicesMap } from './component/AllDevicesMap/AllDevicesMap.jsx'
import { Sidebar } from './component/Sidebar.js'

import './MapApp.css'

export const MapApp = () => {
	return (
		<>
			<Sidebar />
			<AllDevicesMap />
		</>
	)
}
