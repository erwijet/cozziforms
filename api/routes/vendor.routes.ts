import { Router } from 'express';
import VendorModel from '../models/vendor.model';
import { jwt } from '../auth';
import { Types } from 'mongoose';

const vendorApiRouter = Router();

vendorApiRouter.post(
	'/find',
	jwt.verifyAuthStatus({ noRedirect: true }),
	async (req, res) => {
		const query = req.body || {};
		let err;

		const vendors = await VendorModel.find(query).catch((_err) => (err = _err));

		// handle invalid queries, etc
		if (err) return res.status(400).json(err);

		return res.json(vendors);
	}
);

vendorApiRouter.post(
	'/update',
	jwt.verifyAuthStatus({ isAdmin: true, noRedirect: true }),
	async (req, res) => {
		const { _id, name } = req.body;

		if (!_id || !name)
			return res
				.status(400)
				.end('Could not find both _id and name in body json');

		let _err;
		const updated = await VendorModel.findByIdAndUpdate(
			new Types.ObjectId(_id),
			{
				name
			}
		).catch((err) => (_err = err));

		if (_err) return res.status(400).json(_err);
		else return res.json(updated);
	}
);

vendorApiRouter.post(
	'/delete',
	jwt.verifyAuthStatus({ isAdmin: true, noRedirect: true }),
	async (req, res) => {
		const { _id } = req.body;
		if (!_id) return res.status(400).end('Could not find _id in body json');

		let _err;
		const removed = await VendorModel.findByIdAndDelete(
			new Types.ObjectId(_id)
		).catch((err) => (_err = err));

		if (_err) return res.status(400).json(_err);
		else return res.json(removed);
	}
);

export default vendorApiRouter;
