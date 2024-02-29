import type { Resource } from '../../context/Navigation.jsx'
import { Favorite } from '../../icons/LucideIcon.jsx'
import { For, createMemo } from 'solid-js'
import {
	definitions,
	type LwM2MResourceInfo,
	type LwM2MResourceValue,
	LwM2MObjectID,
	instanceTs,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { isLwM2MObjectID } from '@hello.nrfcloud.com/proto-lwm2m'
import type { Device } from '../../context/Devices.jsx'
import { ResourcesDL } from '../ResourcesDL.jsx'
import { DescribeResource } from '../lwm2m/DescribeResource.jsx'

import './DeviceInformation.css'

export const Icon = () => (
	<>
		<Favorite strokeWidth={1} size={24} />
		<small>Favorites</small>
	</>
)

type FavoritedResource = {
	ObjectID: LwM2MObjectID
	resource: Resource
	definition: LwM2MResourceInfo
	value: LwM2MResourceValue | undefined
	ts: Date | undefined
}

export const Card = (props: { resources: Resource[]; device: Device }) => {
	const resourceValues = createMemo(() =>
		props.resources
			.map((resource) => {
				const { ObjectID, ResourceID } = resource
				if (!isLwM2MObjectID(ObjectID)) return undefined
				const definition = definitions[ObjectID].Resources[ResourceID]
				if (definition === undefined) return undefined
				const instance = props.device.state?.find(
					({ ObjectID: id }) => id === ObjectID,
				)
				const resourceValue = instance?.Resources[ResourceID]
				const ts = instance !== undefined ? instanceTs(instance) : undefined
				return {
					ObjectID,
					resource,
					definition,
					value: resourceValue as LwM2MResourceValue | undefined,
					ts,
				}
			})
			.filter((s): s is FavoritedResource => s !== undefined),
	)

	return (
		<ResourcesDL>
			<For each={resourceValues().sort(byNewest)}>
				{(resource) => (
					<DescribeResource
						device={props.device}
						ObjectID={resource.ObjectID}
						info={resource.definition}
						value={resource.value}
						ts={resource.ts}
					/>
				)}
			</For>
		</ResourcesDL>
	)
}

const byNewest = (r1: FavoritedResource, r2: FavoritedResource) =>
	(r2.ts?.getTime() ?? Number.MIN_SAFE_INTEGER) -
	(r1.ts?.getTime() ?? Number.MIN_SAFE_INTEGER)
