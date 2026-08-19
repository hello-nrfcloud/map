import config from '@bifravst/eslint-config-typescript'
export default [
	...config,
	{ ignores: ['dist/**', '.github/workflows/invalidate-cloudfront.ts'] },
	{
		// Solid.js assigns `ref` bindings during compilation, which ESLint cannot see
		files: ['**/*.tsx'],
		rules: { 'no-unassigned-vars': 'off' },
	},
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
