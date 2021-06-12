import { Router } from 'express';
import UserModel from '../models/user.model';

import { jwt } from '../auth';

const userApiRouter = Router();

userApiRouter.post(
	'/create',
	jwt.verifyAuthStatus({ isAdmin: true }),
	async (req, res) => {
		let { isAdmin, firstName, lastName, hash, username } = req.body;
		isAdmin = isAdmin == 'true';

		if (!firstName || !lastName || !hash || !username)
			return res.sendStatus(400);

		UserModel.create(
			{
				isAdmin,
				firstName,
				lastName,
				username,
				hash
			},
			(err, doc) => {
				if (err) {
					res.status(400);
					res.json(err);
					return;
				} else return res.json(doc);
			}
		);
	}
);

userApiRouter.post('/authenticate', async (req, res) => {
	const { username, hash } = req.body;
	if (!username || !hash) return res.sendStatus(400);

	const userDoc = await UserModel.findOne({ username }); // note: username is unique
	if (!userDoc || userDoc?.hash != hash) {
		jwt.revoke(res);
		return res.json({ auth: false, msg: 'invalid username / password' });
	} else {
		const { _id: objectId, firstName, lastName, isAdmin } = userDoc;
		jwt.administer(res, { objectId, username, firstName, lastName, isAdmin });
		return res.json({ auth: true, msg: 'cookie set' });
	}
});

userApiRouter.get('/whoami', jwt.verifyAuthStatus(), (req, res) => {
	res.json(req.user);
});

export default userApiRouter;
