import { AllDevicesMap } from './component/AllDevicesMap/AllDevicesMap.js'
import { UpdateAvailable } from './component/AppUpdate.tsx'
import { NordicHeader } from './component/NordicHeader.jsx'
import { Sidebar } from './component/Sidebar.js'
import { Tutorial } from './component/Tutorial.js'

export const MapApp = () => {
	return (
		<>
			<UpdateAvailable />
			<NordicHeader />
			<Sidebar />
			<Tutorial />
			<AllDevicesMap />
		</>
	)
}
