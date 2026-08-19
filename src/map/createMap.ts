import { useViteEnv } from '#context/ViteEnv.tsx'
import {
	Map as MapLibreGlMap,
	setWorkerUrl,
	type MapOptions,
} from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

/**
 * @see https://docs.aws.amazon.com/location/latest/developerguide/map-styles.html
 */
const mapStyleName = 'Monochrome'

export const createMap = (
	container: HTMLDivElement,
	center: { lat: number; lng: number },
	options?: Partial<MapOptions>,
): MapLibreGlMap => {
	const { mapRegion, mapApiKey } = useViteEnv()
	const { lng, lat } = center
	setWorkerUrl(maplibreWorkerUrl)
	const map = new MapLibreGlMap({
		container,
		style: `https://maps.geo.${mapRegion}.amazonaws.com/v2/styles/${mapStyleName}/descriptor?key=${mapApiKey}&color-scheme=Dark`,
		center: [lng, lat],
		refreshExpiredTiles: false,
		trackResize: true,
		keyboard: false,
		renderWorldCopies: true,
		zoom: options?.zoom ?? 4,
		...options,
	})
	// The AWS style descriptors use a globe projection, but we want a flat map
	map.on('style.load', () => {
		map.setProjection({ type: 'mercator' })
	})

	map.dragRotate.disable()
	map.touchZoomRotate.disableRotation()

	return map
}
