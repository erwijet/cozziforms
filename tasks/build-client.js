// build-client.js
// Tyler Holewinski
//
// build typescript in ./client to javascript with tsify
// then bundle dependencies built code with browserfiy
// and export to ./public/js
//

const fs 			= require('fs');
const { join } 		= require('path');
const browserify 	= require('browserify');

let i = 1;
const files = fs
	.readdirSync(join(__dirname, '..', 'client-lib'))
	.filter((file) => file.split('.').pop() == 'js');

files.forEach((file) => {
	console.log(`[build-client] Processing ${i++} of ${files.length}`);
	const writable = fs.createWriteStream(
		join(
			__dirname,
			'..',
			'public',
			'js',
			file.substr(0, file.length - '.js'.length) + '.js'
		),
		{ flags: 'w' }
	);

	browserify(join(__dirname, '..', 'client-lib', file))
		.bundle()
		.on('error', (err) => {
			throw err;
		})
		.pipe(writable);
});
