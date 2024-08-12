import { useViteEnv } from '#context/ViteEnv.js'
import { parse, type SemVer } from 'semver'

export const logPrefix = `[fetchRelease]`

export const fetchRelease = async (): Promise<SemVer | undefined> => {
	const { baseNoEndSlash } = useViteEnv()
	const url = new URL(
		`${baseNoEndSlash}/.well-known/release?v=${Date.now()}`,
		document.location.href,
	)
	console.debug(logPrefix, `Checking ${url.toString()}...`)
	let res: Response
	try {
		res = await fetch(url, { mode: 'no-cors' })
	} catch (err) {
		console.error(
			logPrefix,
			`Failed to fetch ${url.toString()}: ${(err as Error).message}!`,
		)
		return undefined
	}
	if (!res.ok) {
		console.error(logPrefix, `Version information not found!`)
		console.debug(logPrefix, `Not found: ${res.status}`)
		return undefined
	}
	const versionString = (await res.text()).trim().slice(0, 20)
	const v = parse(versionString)
	if (v === null) {
		console.error(logPrefix, `Could not parse response as semver!`)
		console.debug(logPrefix, versionString)
		return undefined
	}
	return v
}
