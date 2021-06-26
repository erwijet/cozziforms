import { Router } from 'express';
import { jwt } from '../auth';
import { Types } from 'mongoose';

import ItemModel from '../models/item.model';
import CategoryModel from '../models/category.model';
import VendorModel from '../models/vendor.model';

const itemApiRouter = Router();

itemApiRouter.post(
	'/create',
	jwt.verifyAuthStatus({ isAdmin: true, noRedirect: true }),
	async (req, res) => {
		const { name, unitName, vendorId } = req.body;
		if (!name || !vendorId) return res.sendStatus(400);

		// verify vendorId is valid
		if (!(await VendorModel.findById(vendorId))) {
			return res.status(400).end('400 - Invalid VendorId');
		}

		const spec = {
			name,
			vendor: new Types.ObjectId(vendorId),
			unitName
		};

		ItemModel.create(spec, (err, doc) => {
			if (err) return res.status(400).json(err);
			else return res.json(doc);
		});
	}
);

itemApiRouter.post(
	'/find',
	jwt.verifyAuthStatus({ noRedirect: true }),
	async (req, res) => {
		const query = req.body;

		CategoryModel.init();

		let err;
		let items = await ItemModel.find(query)
			.where()
			.populate('vendor')
			.populate('category')
			.catch((_err) => (err = _err));

		if (err) return res.status(400).json(err);

		return res.json(items);
	}
);

itemApiRouter.post(
	'/update',
	jwt.verifyAuthStatus({ isAdmin: true, noRedirect: true }),
	async (req, res) => {
		let body: any = req.body;
		const { itemId } = body || {};

		if (!itemId) return res.sendStatus(400);

		const itemKeys = [
			'name',
			'unitName',
			'defaultQuantity',
			'category',
			'vendor'
		];

		// refine body to only include valid keys
		Object.keys(body).forEach((key) => {
			if (!itemKeys.includes(key)) delete body[key];
		});

		let _err;
		const updated = await ItemModel.updateOne(
			{
				_id: new Types.ObjectId(itemId)
			},
			body
		).catch((err) => (_err = err));

		if (_err) return res.status(400).json(_err);
		else return res.json(updated);
	}
);

export default itemApiRouter;
