import config from '@bifravst/eslint-config-typescript'
export default [
	...config,
	{ ignores: ['dist/**', '.github/workflows/invalidate-cloudfront.ts'] },
	{
		// Solid.js assigns `ref` bindings during compilation, which ESLint cannot see
		files: ['**/*.tsx'],
		rules: { 'no-unassigned-vars': 'off' },
	},
]
