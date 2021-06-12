const util = require('util');
const exec = util.promisify(require('child_process').exec);

const PORT = {
	extern: 80,
	mapped: 5050
};

const CONTAINER_TAG = 'unstable:latest';

async function removeOldContainer() {
	const { stdout, stderr } = await exec(
		`docker image rm cozziforms/${CONTAINER_TAG}`
	);

	console.log(`stdout: ${stdout}`);
	console.log(`stderr: ${stderr}`);

	console.log('[ del ] done');
}

async function buildContainer() {
	const { stdout, stderr } = await exec(
		`docker build . -t cozziforms/${CONTAINER_TAG}`
	);
	console.log(`stdout: ${stdout}`);
	console.log(`stderr: ${stderr}`);

	console.log('[build] done');
}

async function runContainer() {
	const { stdout, stderr } = await exec(
		`docker run -p ${PORT.extern}:${PORT.mapped} -d cozziforms/${CONTAINER_TAG}`
	);
	console.log(`stdout: ${stdout}`);
	console.log(`stderr: ${stderr}`);

	console.log('[ run ] done');
}

(async () => {
	await removeOldContainer();
	await buildContainer();
	await runContainer();

	console.log('[ all ] done');
	process.exit();
})();
