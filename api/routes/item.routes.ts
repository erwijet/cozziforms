import { Router } from 'express';
import { jwt } from '../auth';
import { Types } from 'mongoose';

import ItemModel from '../models/item.model';
import VendorMode from '../models/vendor.model';
import VendorModel from '../models/vendor.model';

const itemApiRouter = Router();

itemApiRouter.post(
	'/create',
	jwt.verifyAuthStatus({ isAdmin: true }),
	async (req, res) => {
		const { name, unitName, defaultQuantity, vendorId } = req.body;
		if (!name || !vendorId) return res.sendStatus(400);

		// verify vendorId is valid
		if (!(await VendorModel.findById(vendorId))) {
			console.log('invalid');
			return res.end();
		}

		const spec = {
			name,
			vendor: new Types.ObjectId(vendorId),
			defaultQuantity,
			unitName
		};

		ItemModel.create(spec, (err, doc) => {
			if (err) return res.status(400).json(err);
			else return res.json(doc);
		});
	}
);

export default itemApiRouter;
