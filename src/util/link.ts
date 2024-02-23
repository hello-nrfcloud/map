export const link = (target: string): string => `${BASE_URL}${target}`

export const linkToPanel = (panel: string, query?: URLSearchParams): string =>
	link(`/#${panel}${query !== undefined ? `?${query.toString()}` : ''}`)

export const linkToHome = (): string => link('/#')

export const reloadLink = (): string => link('/')

export const linkToDevice = (id: string): string => link(`/#id:${id}`)

export const linkAsset = (path: string): string =>
	link(`/assets/${encodeURIComponent(path)}`)
