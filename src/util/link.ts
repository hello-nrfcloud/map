import { trimTrailingSlash } from './trimTrailingSlash.js'

export const link = (target: string): string =>
	`${trimTrailingSlash(BASE_URL ?? '/')}${target}`
