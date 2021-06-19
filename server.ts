import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import { join } from 'path';

import { jwt } from './api/auth';
import api from './api/api';

dotenv.config();

const app = express();
const PORT = Number.parseInt(process.env.PORT || '5050');

app.set('view engine', 'pug');

app.use(morgan('common'));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.use('/api', api);

app.get('/', (req, res) => {
	res.redirect('/orderlist');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/orderlist', jwt.verifyAuthStatus(), (req, res) => {
	res.render('index', { user: req.user });
});

app.get('/me', (req, res) => {
	res.render('account', { user: req.user });
});

app.get('/waste', jwt.verifyAuthStatus(), (req, res) => {
	res.render('waste', { user: req.user });
});

app.get('/review', jwt.verifyAuthStatus({ isAdmin: true }), (req, res) => {
	res.render('review', { user: req.user });
});

app.get('/manage/:key', jwt.verifyAuthStatus({ isAdmin: true }), (req, res) => {
	const templateName = `manage_${req.params.key}`;
	if (fs.existsSync(join(__dirname, 'views', templateName + '.pug')))
		return res.render(templateName, { user: req.user });
	else return res.end('management page could not be found :(');
});

app.get('/logout', (req, res) => {
	jwt.revoke(res);
	res.redirect('/');
});

app.get('*', (req, res) => res.render('404'));

app.listen(PORT, '0.0.0.0', () =>
	console.log('server listening on port ' + PORT)
);
