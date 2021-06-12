import { Router } from 'express';
import { checkDBConnection } from './db';

import userRouter from './routes/user.routes';
import itemRouter from './routes/item.routes';

const apiRouter = Router();

apiRouter.use(async (req, res, next) => {
	await checkDBConnection();
	next();
});

apiRouter.use('/user', userRouter);
apiRouter.use('/item', itemRouter);

export default apiRouter;
