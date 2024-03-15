import { AllDevicesMap } from './component/AllDevicesMap/AllDevicesMap.js'
import { NordicHeader } from './component/NordicHeader.jsx'
import { Sidebar } from './component/Sidebar.js'
import { Tutorial } from './component/Tutorial.js'

export const MapApp = () => {
	return (
		<>
			<NordicHeader />
			<Sidebar />
			<Tutorial />
			<AllDevicesMap />
		</>
	)
}
