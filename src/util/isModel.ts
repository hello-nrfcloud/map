import { ModelID, models } from '@hello.nrfcloud.com/proto-map'

export const DeviceModels = Object.keys(models)

export const isModel = (s: unknown): s is ModelID =>
	typeof s === 'string' && DeviceModels.includes(s)
