// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/ts-nameof/ts-nameof.d.ts" />
import 'express-async-errors';
import 'reflect-metadata';

import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { routes } from './routes';
import { errorMiddleware } from './server/middlewares/error.middleware';
import { logger, loggerStream } from './server/utils/logger';

const app = express();
app.use(morgan('combined', { stream: loggerStream }));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

app.use('/', routes);
app.use(errorMiddleware);

(async (): Promise<void> => {
  // Do not initialize bluebird before calling plugin manager as it causes issues
  require('./bluebird');

  // Start the server
  app.listen(3000, () => {
    logger.info(`Server running on port 3000`);
  });
})();
