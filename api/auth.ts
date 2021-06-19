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
		isAdmin?: boolean;
		username?: string;
		firstName?: string;
		lastName?: string;
		objectId?: string;

		// this is here b/c of ts not letting me assign type A to A | undef lol
		isNull?: boolean;
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
		isAdmin?: boolean;
		noRedirect?: boolean;
	}

	// return middleware to authenticate user based on authRequestOpts
	export function verifyAuthStatus(
		opts?: authRequestOpts
	): AuthenticationMiddleware {
		return (req: ExpressReq, res: ExpressRes, next: ExpressNxt) => {
			decode(req, res, (usr) => {
				if (usr.isNull) {
					// user is not authed
					if (opts?.noRedirect) return res.sendStatus(403);
					else
						return res.redirect('/login?rdr=' + encodeURIComponent(req.path));
				}

				// case if admin is requied and admin is provided
				if (opts?.isAdmin && usr.isAdmin) {
					req.user = usr;
					return next();
				}

				// case if admin is NOT required, but a user still exists
				if (!opts?.isAdmin) {
					req.user = usr;
					return next();
				}

				// otherwise, admin is requied, but user is not an admin
				if (opts?.noRedirect) return res.sendStatus(403);
				else return res.redirect('/login?rdr=' + encodeURIComponent(req.path));
			});
		};
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
		if (!token) return cb({ isNull: true });
		jsonWebToken.verify(token, JWT_SECRET, (err: any, usr: any) => {
			// most likely an api call so don't redirect
			if (err && bearerToken) return res.sendStatus(403);
			else if (err) {
				// otherwise, if the cookie was incorrect, it's most
				// likely expired, so prompt user for new cookie.
				res.clearCookie('usr');
				return cb({ isNull: true });
				// return res.redirect('/login?rdr=' + encodeURIComponent(req.path));
			}

			cb(usr as JwtPayload);
		});
	}
}
