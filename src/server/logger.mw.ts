import { Request, Response, NextFunction } from 'express';
import {Logger} from '../logger';
import { stdSerializers } from 'pino';

export const LoggingMw = (req: Request, res: Response, next: NextFunction) => {
    const apiLogger = Logger.child({ loggedAt: 'sever/logger.mw' });

    apiLogger.info(
        { req: { ...stdSerializers.req(req) } },
        'Request received'
    );
    res.on('finish', () => {
        apiLogger.info({ res: { ...stdSerializers.res(res) } }, 'Request completed');
    });
    res.on('error', (error) => {
        apiLogger.error({ error: stdSerializers.err(error) }, 'Request errored out');
    });
    res.on('close', () => {
        apiLogger.info('Request completed, session closed by client');
    });
    next();
}
