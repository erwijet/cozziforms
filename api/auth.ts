import jsonWebToken from 'jsonwebtoken';
import { config } from 'dotenv';

import type {
	Request as ExpressReq,
	Response as ExpressRes,
	NextFunction as ExpressNxt
} from 'express';

config();

// extend express framework to include Express::Request.user
// for storing user data pulled from JWT in header / cookie
declare global {
	namespace Express {
		interface Request {
			user: jwt.JwtPayload;
		}
	}
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export namespace jwt {
	const COOKIE_NAME = 'usr';

	export interface JwtPayload {
		isAdmin: boolean;
		username: string;
		firstName: string;
		lastName: string;
		objectId: string;
	}

	export interface AuthenticationMiddleware {
		(req: ExpressReq, res: ExpressRes, next: ExpressNxt): void;
	}

	export function administer(res: ExpressRes, payload: JwtPayload) {
		const token = jsonWebToken.sign(payload, JWT_SECRET, {
			expiresIn: '1800s'
		});

		// "httpOnly: true" means it *cannot* be accessed by client-side
		// javascript, providing a layer of security from unforseen XSS attacks
		res.cookie(COOKIE_NAME, token, { httpOnly: true });
	}

	export function revoke(res: ExpressRes) {
		res.clearCookie(COOKIE_NAME);
	}

	interface authRequestOpts {
		isAdmin: boolean;
	}

	// select authentication routine to use based on auth level needed
	export function verifyAuthStatus(
		opts?: authRequestOpts
	): AuthenticationMiddleware {
		if (opts?.isAdmin) return requireAuthLevelAdmin;
		else return requireAuthLevelBasic;
	}

	function requireAuthLevelBasic(
		req: ExpressReq,
		res: ExpressRes,
		next: ExpressNxt
	) {
		//  regardless of auth status, if any user is logged in,
		//  then proceed to next request handler
		decode(req, res, (usr) => {
			req.user = usr;
			next();
		});
	}

	function requireAuthLevelAdmin(
		req: ExpressReq,
		res: ExpressRes,
		next: ExpressNxt
	) {
		decode(req, res, (usr) => {
			if (!usr) return; // response already handled by decode/3

			// if active user is admin, proceed to next handler,
			// otherwise *handle request* by redirecting to sign in
			if (usr.isAdmin) {
				req.user = usr;
				next();
			} else return res.redirect('/login?rdr=' + encodeURIComponent(req.path));
		});
	}

	function decode(
		req: ExpressReq,
		res: ExpressRes,
		cb: (usr: JwtPayload) => void
	) {
		const authHeader = req.headers['authorization'];
		const bearerToken = authHeader?.split(' ')[1];

		// use either bearer token or the 'usr' cookie if no bearer token is present
		const token = bearerToken ?? req.cookies[COOKIE_NAME];

		// no token no access
		if (!token)
			return res.redirect('/login?rdr=' + encodeURIComponent(req.path));

		jsonWebToken.verify(token, JWT_SECRET, (err: any, usr: any) => {
			// most likely an api call so don't redirect
			if (err && bearerToken) return res.sendStatus(403);
			else if (err) {
				// otherwise, if the cookie was incorrect, it's most
				// likely expired, so prompt user for new cookie.
				res.clearCookie('usr');
				return res.redirect('/login?rdr=' + encodeURIComponent(req.path));
			}

			cb(usr as JwtPayload);
		});
	}
}
