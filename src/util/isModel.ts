import type { ModelID } from '@hello.nrfcloud.com/proto-map/models'
import { models } from '@hello.nrfcloud.com/proto-map/models'

export const DeviceModels = Object.keys(models)

export const isModel = (s: unknown): s is ModelID =>
	typeof s === 'string' && DeviceModels.includes(s)
