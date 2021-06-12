// random-64.js
// Tyler Holewinski
//
// generate random secret for use in .env for signing JWT's
//

const { randomBytes } = require('crypto');

function newSecret() {
	return randomBytes(64).toString('hex');
}

console.log(newSecret());
