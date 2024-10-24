import type { Parameters } from '#context/Parameters.js'
import { mapStyle } from '#map/style.js'
import { transformRequest } from '#map/transformRequest.js'
import { Map as MapLibreGlMap, type MapOptions } from 'maplibre-gl'

export const createMap = (
	container: HTMLDivElement,
	parameters: Parameters,
	center: { lat: number; lng: number },
	options?: Partial<MapOptions>,
): MapLibreGlMap => {
	const { lng, lat } = center
	const map = new MapLibreGlMap({
		container,
		style: mapStyle({
			region: parameters.mapRegion,
			mapName: parameters.mapName,
		}),
		center: [lng, lat],
		refreshExpiredTiles: false,
		trackResize: true,
		keyboard: false,
		renderWorldCopies: true,
		transformRequest: transformRequest(
			parameters.mapApiKey,
			parameters.mapRegion,
		),
		zoom: options?.zoom ?? 4,
		...options,
	})
	map.dragRotate.disable()
	map.touchZoomRotate.disableRotation()

	return map
}
