export const link = (target: string): string => `${BASE_URL}${target}`

export const reloadLink = (): string => link('/')

export const linkAsset = (path: string): string =>
	link(`/assets/${encodeURIComponent(path)}`)
