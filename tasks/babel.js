/**
 * tasks/babel.js
 * Tyler Holewinski
 *
 * Production target for cozziforms is a clover terminal
 * running firefox v42.
 *
 * So yeah, like nothing works if we don't use babel, lol
 */

require('@babel/core').transformSync('code', {
	presets: [
		[
			'@babel/env',
			{
				targets: {
					firefox: '42'
				},
				useBuiltIns: 'usage'
			}
		]
	],
	plugins: ['@babel/plugin-proposal-optional-chaining']
});
