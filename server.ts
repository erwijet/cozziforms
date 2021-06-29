import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { join } from 'path';

import { jwt } from './api/auth';
import api from './api/api';
import redirects from './redirect-handler';

dotenv.config();

const app = express();
const PORT = Number.parseInt(process.env.PORT || '5050');

app.set('view engine', 'pug');

app.use(morgan('common'));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.use('/', redirects);
app.use('/api', api);

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

app.get(
	'/dashboard/:key',
	jwt.verifyAuthStatus({ isAdmin: true }),
	(req, res) => {
		const { key } = req.params;

		const renderOpts = { user: req.user };

		switch (key) {
			case 'items':
				return res.render('manage-items', renderOpts);
			case 'vendors':
				return res.render('manage-vendors', renderOpts);
			case 'users':
				return res.render('manage-users', renderOpts);
			default:
				return res.redirect('/dashboard/items');
		}
	}
);

app.get('/logout', (req, res) => {
	jwt.revoke(res);
	res.redirect('/');
});

app.get('*', (req, res) => res.render('404'));

app.listen(PORT, '0.0.0.0', () =>
	console.log('server listening on port ' + PORT)
);
