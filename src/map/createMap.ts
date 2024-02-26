import { Map as MapLibreGlMap } from 'maplibre-gl'
import { mapStyle } from '../map/style.js'
import { transformRequest } from '../map/transformRequest.jsx'
import type { Parameters } from '../context/Parameters.jsx'

export const createMap = (
	container: HTMLDivElement,
	parameters: Parameters,
	{ lng, lat }: { lat: number; lng: number },
	zoom = 4,
): MapLibreGlMap => {
	const map = new MapLibreGlMap({
		container,
		style: mapStyle({
			region: parameters.mapRegion,
			mapName: parameters.mapName,
		}),
		center: [lng, lat],
		zoom,
		refreshExpiredTiles: false,
		trackResize: true,
		keyboard: false,
		renderWorldCopies: true,
		transformRequest: transformRequest(
			parameters.mapApiKey,
			parameters.mapRegion,
		),
		attributionControl: false,
	})

	return map
}
