import { Router } from 'express';
import VendorModel from '../models/vendor.model';
import { jwt } from '../auth';

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

export default vendorApiRouter;
