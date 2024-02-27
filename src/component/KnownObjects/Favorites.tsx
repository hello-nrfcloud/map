import type { Resource } from '../../context/Navigation.jsx'
import { Favorite } from '../../icons/LucideIcon.jsx'
import { For, createMemo } from 'solid-js'
import {
	definitions,
	type LwM2MResourceInfo,
	type LwM2MResourceValue,
	LwM2MObjectID,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { isLwM2MObjectID } from '../../util/lwm2m.js'
import type { Device } from '../../context/Devices.jsx'
import { ResourcesDL } from '../ResourcesDL.jsx'
import { DescribeResource } from '../LwM2M.jsx'

import './DeviceInformation.css'

export const Icon = () => (
	<>
		<Favorite strokeWidth={1} size={24} />
		<small>Favorites</small>
	</>
)

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
				return {
					ObjectID,
					resource,
					definition,
					value: resourceValue as LwM2MResourceValue | undefined,
				}
			})
			.filter(
				(
					s,
				): s is {
					ObjectID: LwM2MObjectID
					resource: Resource
					definition: LwM2MResourceInfo
					value: LwM2MResourceValue | undefined
				} => s !== undefined,
			),
	)

	return (
		<ResourcesDL>
			<For each={resourceValues()}>
				{(resource) => (
					<DescribeResource
						device={props.device}
						ObjectID={resource.ObjectID}
						info={resource.definition}
						value={resource.value}
					/>
				)}
			</For>
		</ResourcesDL>
	)
}
