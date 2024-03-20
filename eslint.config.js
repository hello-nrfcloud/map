import config from '@bifravst/eslint-config-typescript'
export default [
	...config,
	{ ignores: ['dist/**', '.github/workflows/invalidate-cloudfront.ts'] },
	{
		rules: {
			'no-restricted-globals': [
				'error',
				// Sync with ./src/vite-env.d.ts
				'BASE_URL',
				'HOMEPAGE',
				'VERSION',
				'BUILD_TIME',
				'REGISTRY_ENDPOINT',
				'REPOSITORY_URL',
				'PROTO_VERSION',
			],
		},
	},
]
