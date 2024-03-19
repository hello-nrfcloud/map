import pJson from '../package.json'

export const version = process.env.VERSION ?? pJson.version ?? Date.now()
export const protoVersion = `v${pJson.dependencies['@hello.nrfcloud.com/proto-map']}`
export const homepage = pJson.homepage
export const repositoryUrl = pJson.repository.url.replace('git+', '')
