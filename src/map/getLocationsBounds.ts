import { type Geolocation_14201 } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { LngLatBounds } from 'maplibre-gl'
import { getPolygonCoordinatesForCircle } from './geoJSONPolygonFromCircle.js'

export const getLocationsBounds = (
	locations: Geolocation_14201[],
): LngLatBounds => {
	const coordinates = locations
		.map(({ Resources }) => {
			const lng = Resources[1]
			const lat = Resources[0]
			const acc = Resources[3] ?? 500
			return getPolygonCoordinatesForCircle([lng, lat], acc, 6, Math.PI / 2)
		})
		.flat()
	return coordinates.reduce(
		(bounds, coord) => {
			return bounds.extend(coord)
		},
		new LngLatBounds(coordinates[0], coordinates[0]),
	)
}
