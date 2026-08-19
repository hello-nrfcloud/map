import type { Parameters } from '#context/Parameters.tsx'
import { mapStyle } from '#map/style.ts'
import { transformRequest } from '#map/transformRequest.tsx'
import {
	Map as MapLibreGlMap,
	setWorkerUrl,
	type MapOptions,
} from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

export const createMap = (
	container: HTMLDivElement,
	parameters: Parameters,
	center: { lat: number; lng: number },
	options?: Partial<MapOptions>,
): MapLibreGlMap => {
	const { lng, lat } = center
	setWorkerUrl(maplibreWorkerUrl)
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
