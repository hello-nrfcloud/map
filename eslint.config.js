import config from '@bifravst/eslint-config-typescript'
export default [
	...config,
	{ ignores: ['dist/**', '.github/workflows/invalidate-cloudfront.ts'] },
]
