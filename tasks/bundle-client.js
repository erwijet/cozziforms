/**
 * tasks/bundle-client.js
 * Tyler Holewinski
 *
 * bundle files in .\client folder
 * and run them through babel to make them compatable with
 * Firefox 42, which is our production target.
 *
 * When run with --production, each file will also be passed through
 * uglifyify to minify the bundle and reduce production load times
 */

const fs = require('fs');
const { join } = require('path');
const browserify = require('browserify');

const isProd = process.argv[2] == '--production';

const SOURCE = join(__dirname, '..', 'client');
const SOURCE_LIB = join(SOURCE, 'lib');
const TARGET = join(__dirname, '..', 'public', 'js');
const TARGET_LIB = join(TARGET, 'lib');

if (!fs.existsSync(TARGET)) fs.mkdirSync(TARGET);
if (!fs.existsSync(TARGET_LIB)) fs.mkdirSync(TARGET_LIB);

if (isProd) {
	console.log(
		'๐ [  PROD  ] Production mode enabled\n' +
			'   ---------> Bundles will be minified\n'
	);
}

if (fs.existsSync(TARGET)) {
	console.log('๐งน [  FYI  ] Cleaning output dir');
	fs.readdirSync(TARGET)
		.filter((path) => path != 'lib')
		.forEach((file) => fs.unlinkSync(join(TARGET, file)));
	console.log('๐ [ Done! ] Directory cleaned');
}

let i = 0;
const files = fs
	.readdirSync(SOURCE)
	.filter((file) => file.split('.').pop() == 'js')
	.filter((file) => file != 'require.js'); // don't bundle require.js

if (!fs.existsSync(join(TARGET_LIB, 'require.js'))) {
	console.log('๐คท [  FYI  ] Could not find require.js in <target>/lib.');
	console.log('   --------> File will be copied from source');
	fs.copyFileSync(
		join(SOURCE_LIB, 'require.js'),
		join(TARGET_LIB, 'require.js')
	);
	console.log('๐ [ Done! ] copy finished.');
}

if (!fs.existsSync(join(TARGET_LIB, 'babel-polyfill.js'))) {
	console.log('๐คท [  FYI  ] Could not find babel-polyfill.js in <target>/lib');
	console.log('   --------> <src>/lib/babel-polyfill.js will be bundled.');
	browserify(join(SOURCE_LIB, 'babel-polyfill.js'))
		.transform('babelify')
		.bundle()
		.on('error', (err) => {
			throw err;
		})
		.on('end', () => console.log('๐ [Bundled] babel-polyfill.js'))
		.pipe(fs.createWriteStream(join(TARGET_LIB, 'babel-polyfill.js')));
}

console.log('โจ [ Start ] Bundling...');

files.forEach((file) => {
	const writable = fs.createWriteStream(join(TARGET, file), {
		flags: 'w'
	});

	let bundler = browserify(join(SOURCE, file)).transform('babelify');
	if (isProd) bundler = bundler.transform('uglifyify', { global: true });

	bundler
		.bundle()
		.on('error', (err) => {
			throw err;
		})
		.on('end', (e) => {
			i++;
			console.log('๐ [Bundled] ' + file);
			if (i == files.length) {
				console.log('\n๐ [ Done ] ' + i + ' files bundled');
				process.exit();
			}
		})
		.pipe(writable);
});
