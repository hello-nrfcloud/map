import { CloudFormationClient } from '@aws-sdk/client-cloudformation'
import {
	CloudFrontClient,
	CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront'
import { stackOutput } from '@bifravst/cloudformation-helpers'
import { glob } from 'glob'
import { randomUUID } from 'node:crypto'
import path, { parse } from 'node:path'
import { encloseWithSlash } from '../../src/util/encloseWithSlash.js'

const cloudFront = new CloudFrontClient({})
const cloudFormation = new CloudFormationClient({})

const buildDir = path.join(process.cwd(), 'build', 'client')

const htmlFiles = await glob('*/**/*.html', {
	cwd: buildDir,
})
const base = encloseWithSlash(process.env.BASE_URL ?? '')
const pathesToInvalidate = [
	`${base}`,
	`${base}manifest.json`,
	`${base}.well-known/release`,
	...htmlFiles.map((f) => `${base}${encodeURIComponent(f)}`),
	...htmlFiles.map((f) => `${base}${encodeURIComponent(parse(f).dir)}/`),
]

const stackName = process.env.STACK_NAME ?? 'hello-nrfcloud-web'
console.log('Stack name:', stackName)

const { distributionId } = await stackOutput(cloudFormation)<{
	distributionId: string
}>(stackName)

console.log('Distribution ID:', distributionId)

console.log('Pathes to invalidate:')
pathesToInvalidate.map((s) => console.log('-', s))

const { Invalidation } = await cloudFront.send(
	new CreateInvalidationCommand({
		DistributionId: distributionId,
		InvalidationBatch: {
			Paths: {
				Quantity: pathesToInvalidate.length,
				Items: pathesToInvalidate,
			},
			CallerReference: randomUUID(),
		},
	}),
)

console.log('Invalidation created!')
console.log('Invalidation ID:', Invalidation?.Id)
