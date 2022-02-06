/**
 * This module can be out-sourced to an inhouse package feed or npm registry,
 * to facilitate reusibility
 */

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import express, { Router, Application } from 'express';
import helmet from 'helmet';
import responseTime from 'response-time';
import http from 'http';
// import expressRequestId from 'express-request-id';
import {Logger} from '../logger';
import { ErrorHandlerMw } from './error-handler.mw';
import { LoggingMw} from './logger.mw';

const expressApp = (routes: Router): Application => {
  const app: Application = express();
  /* Configuration of common middle wears */
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(cookieParser());
  app.use(responseTime());
//   app.use(expressRequestId());
  
  /* Request Response Logging */
  app.use(LoggingMw);

  /* Setup routes */
  app.use('/', routes);

  /* Express app error handler */
  app.use(ErrorHandlerMw);

  return app;
}

export const Server = (routes: Router, port: number = 3000) => {
  const app = expressApp(routes);
  /* Create http server using express app */
  http.createServer(app).listen(port, () => {
    Logger.info(`App is running at ${port}`);
  });

  /* Handlers for process level exception on the node*/
  process.on('uncaughtException', (err) => {
    Logger.error({ error:{name: err['name'], stack: `${err['stack']}`}}, "Uncaught Exception - Exit Process with code:1!");
    process.exit(1); // exit application 
  });
  process.on('unhandledRejection', (err, promise) => {
    Logger.error({ error:{name: err['name'], stack: `${err['stack']}`}}, "Unhandled promise rejection - Exit Process with code:1!");
    process.exit(1); // exit application 
  });
}
