import { json, Router } from 'express';

interface RdrMapIdxSignature {
	[key: string]: string;
}

const redirectRouter = Router();

const redirectMap: RdrMapIdxSignature = {
	'/': '/orderlist',
	'/dashboard': '/dashboard/items'
};

Object.keys(redirectMap).forEach((target) =>
	redirectRouter.get(target, (req, res) =>
		res.status(301).redirect(redirectMap[target])
	)
);

// forward all other requests to root router
redirectRouter.use((req, res, next) => next());

export default redirectRouter;
