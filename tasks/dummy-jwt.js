// dummy-jwt.js
// Tyler Holewinkski
//
// Generate a full-permission bearer token to simulate a
// dummy user from the local .env file of spec:
// // hash: 'd41d8cd98f00b204e9800998ecf8427e'
// // firstName: 'dummyFirstname',
// // lastName: 'dummySurname'
// // isAdmin: true,
// // username: '123456789'
//
// note: dependent upon a present .env file with a JWT_SECRET value (see tasks/random64.js)
// note: signed jwt should be passed to api call as a bearer token
//

const jwt 			= require('jsonwebtoken');
const { config } 	= require('dotenv');

config();

const { JWT_SECRET } = process.env;

function createJWT() {
	const spec = {
		isAdmin: true,
		firstName: 'dummyFirstname',
		lastName: 'dummyLastname',
		username: '123456789',
		hash: 'd41d8cd98f00b204e9800998ecf8427e'
	};

	return jwt.sign(spec, JWT_SECRET, { expiresIn: '1800s' });
}

console.log(createJWT());
