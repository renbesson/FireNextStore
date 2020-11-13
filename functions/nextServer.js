const { https } = require('firebase-functions');
const { default: next } = require('next');

const isDev = process.env.NODE_ENV !== 'production';

const path = require('path');
const parentDir = require('path').resolve(__dirname, '..');

const server = next({
	dev: isDev,
	//location of .next generated after running -> yarn build
	conf: { distDir: `${path.relative(process.cwd(), __dirname)}/.next` },
});

const nextjsHandle = server.getRequestHandler();
exports.nextServer = https.onRequest((req, res) => {
	return server.prepare().then(() => nextjsHandle(req, res));
});
