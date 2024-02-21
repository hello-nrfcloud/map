import { Search } from './component/Search.js'
import { Devices } from './component/Devices.js'
import { Sidebar } from './component/Sidebar.js'

import './MapApp.css'

export const MapApp = () => {
	return (
		<>
			<Sidebar />
			<Search />
			<main>
				<Devices />
			</main>
		</>
	)
}
