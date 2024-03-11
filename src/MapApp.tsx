import { AllDevicesMap } from './component/AllDevicesMap/AllDevicesMap.js'
import { Sidebar } from './component/Sidebar.js'
import { Tutorial } from './component/Tutorial.js'

import './MapApp.css'

export const MapApp = () => {
	return (
		<>
			<Sidebar />
			<Tutorial />
			<AllDevicesMap />
		</>
	)
}
