import { Center, Map, ZoomIn } from '../../icons/LucideIcon.jsx'
import { type Geolocation_14201 } from '@hello.nrfcloud.com/proto-lwm2m'
import { createEffect, onCleanup } from 'solid-js'
import { Map as MapLibreGlMap, LngLatBounds } from 'maplibre-gl'
import { mapStyle } from '../../map/style.js'
import { useParameters } from '../../context/Parameters.jsx'
import { transformRequest } from '../../map/transformRequest.jsx'

import './Location.css'
import {
	geoJSONPolygonFromCircle,
	getPolygonCoordinatesForCircle,
} from '../../map/geoJSONPolygonFromCircle.js'
import { ZoomOut } from '../../icons/LucideIcon.js'
import { ResourcesDL } from '../ResourcesDL.jsx'

export const Icon = ({ location }: { location: Geolocation_14201 }) => (
	<>
		<Map strokeWidth={1} size={24} />
		<small>{location.Resources[6]}</small>
	</>
)

export const Card = ({ location }: { location: Geolocation_14201 }) => {
	const parameters = useParameters()
	const lng = location.Resources[1]
	const lat = location.Resources[0]
	const acc = location.Resources[3] ?? 500
	const src = location.Resources[6]

	let ref!: HTMLDivElement
	let map: MapLibreGlMap

	const coordinates = getPolygonCoordinatesForCircle(
		[lng, lat],
		acc,
		6,
		Math.PI / 2,
	)
	const bounds = coordinates.reduce(
		(bounds, coord) => {
			return bounds.extend(coord)
		},
		new LngLatBounds(coordinates[0], coordinates[0]),
	)

	createEffect(() => {
		map = new MapLibreGlMap({
			container: ref,
			style: mapStyle({
				region: parameters.mapRegion,
				mapName: parameters.mapName,
			}),
			center: [lng, lat],
			zoom: 12,
			refreshExpiredTiles: false,
			trackResize: false,
			keyboard: false,
			renderWorldCopies: false,
			transformRequest: transformRequest(
				parameters.mapApiKey,
				parameters.mapRegion,
			),
			attributionControl: false,
		})
		map.dragRotate.disable()
		map.scrollZoom.disable()
		map.dragPan.disable()

		map.on('load', () => {
			// Data for Hexagon
			map.addSource(
				'center-circle-source',
				geoJSONPolygonFromCircle([lng, lat], acc, 6, Math.PI / 2),
			)
			// Render Hexagon
			map.addLayer({
				id: 'center-circle-layer',
				type: 'line',
				source: 'center-circle-source',
				layout: {},
				paint: {
					'line-color': locationSourceColors[src] ?? defaultLocationSourceColor,
					'line-opacity': 1,
					'line-width': 2,
				},
			})

			map.fitBounds(bounds, {
				padding: 20,
			})
		})
	})

	onCleanup(() => {
		map?.remove()
	})

	return (
		<>
			<div class="map-container">
				<nav>
					<button type="button" onClick={() => map?.zoomIn()}>
						<ZoomIn />
					</button>
					<button
						type="button"
						onClick={() =>
							map?.fitBounds(bounds, {
								padding: 20,
							})
						}
					>
						<Center />
					</button>
					<button type="button" onClick={() => map?.zoomOut()}>
						<ZoomOut />
					</button>
				</nav>
				<div class="map" ref={ref} />
			</div>
			<ResourcesDL>
				<dt>Accuracy</dt>
				<dd>{`${Math.round(acc)} m`}</dd>
			</ResourcesDL>
		</>
	)
}

// Source: https://coolors.co/palette/22577a-38a3a5-57cc99-80ed99-c7f9cc
const locationSourceColors: Record<string, string> = {
	['GNSS']: '#C7F9CC',
	['WIFI']: '#80ed99',
	['MCELL']: '#57cc99',
	['SCELL']: '#38a3a5',
} as const
const defaultLocationSourceColor = '#22577A'
