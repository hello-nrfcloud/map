import { APIHealth } from './component/APIHealth.tsx'
import { AllDevicesMap } from './component/AllDevicesMap/AllDevicesMap.js'
import { UpdateAvailable } from './component/AppUpdate.tsx'
import { NordicHeader } from './component/NordicHeader.jsx'
import { Sidebar } from './component/Sidebar.js'
import { Tutorial } from './component/Tutorial/Tutorial.tsx'

export const MapApp = () => {
	return (
		<>
			<APIHealth />
			<UpdateAvailable />
			<NordicHeader />
			<Sidebar />
			<Tutorial />
			<AllDevicesMap />
		</>
	)
}
