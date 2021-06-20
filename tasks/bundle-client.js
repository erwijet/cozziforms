// bundle-client.js
// Tyler Holewinski
//
// build typescript in ./client to javascript with tsify
// then bundle dependencies built code with browserfiy
// and export to ./public/js
//

/**
 * tasks/bundle-client.js
 * Tyler Holewinski
 *
 * bundle files in .\client folder
 * and run them through babel to
 */

const fs = require('fs');
const { join } = require('path');
const browserify = require('browserify');

let i = 0;
const files = fs
	.readdirSync(join(__dirname, '..', 'client'))
	.filter((file) => file.split('.').pop() == 'js')
	.filter((file) => file != 'require.js'); // don't bundle require.js

if (!fs.existsSync(join(__dirname, '..', 'public', 'js', 'require.js'))) {
	console.log(
		'😑 [ Alert ] Could not find require.js in target folder. Copying...'
	);
	fs.copyFileSync(
		join(__dirname, '..', 'client', 'lib', 'require.js'),
		join(__dirname, '..', 'public', 'js', 'require.js')
	);
	console.log('😀 [ Done! ] copy finished.');
}

console.log('✨ [ Start ] Bundling...');

files.forEach((file) => {
	const writable = fs.createWriteStream(
		join(__dirname, '..', 'public', 'js', file),
		{
			flags: 'w'
		}
	);

	browserify(join(__dirname, '..', 'client', file))
		.transform('babelify')
		.bundle()
		.on('error', (err) => {
			throw err;
		})
		.on('end', (e) => {
			i++;
			console.log('👉 [Bundled] ' + file);
			if (i == files.length) {
				console.log('\n🏁 [ Done ] ' + i + ' files bundled');
				process.exit();
			}
		})
		.pipe(writable);
});
