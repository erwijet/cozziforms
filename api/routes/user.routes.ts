import { Router } from 'express';
import UserModel from '../models/user.model';

import { jwt } from '../auth';
import { Types } from 'mongoose';

const userApiRouter = Router();

interface StringIndexed {
	[key: string]: string;
}

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

userApiRouter.get(
	'/whoami',
	jwt.verifyAuthStatus({ noRedirect: true }),
	(req, res) => {
		res.json(req.user);
	}
);

userApiRouter.post(
	'/update',
	jwt.verifyAuthStatus({ isAdmin: true, noRedirect: true }),
	async (req, res) => {
		const { id } = req.body;

		let updateSpec: StringIndexed = {};

		['username', 'firstName', 'lastName', 'isAdmin', 'hash'].forEach((key) => {
			if (req.body[key]) updateSpec[key] = req.body[key];
		});

		let _err;
		const updated = await UserModel.findByIdAndUpdate(
			new Types.ObjectId(id),
			updateSpec
		).catch((err) => (_err = err));

		if (_err) return res.status(400).json(_err);
		else return res.json(updated);
	}
);

export default userApiRouter;
