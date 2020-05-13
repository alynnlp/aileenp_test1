import { Router } from 'express';

import { appContainer } from '../inversify.config';
import { LoadFundsController } from '../server/controllers/load-funds.controller';

const routes = Router();

const loadFundsController = appContainer.get<LoadFundsController>(
  nameof<LoadFundsController>()
);

routes.get('/', loadFundsController.getFunds.bind(loadFundsController));

export { routes };
