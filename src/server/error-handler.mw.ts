import { Request, Response, NextFunction } from "express";
import { AppError } from "../error";
import {Logger} from "../logger";

export const ErrorHandlerMw = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errLogger = Logger.child({
        loggedAt: "server/error-handler.mw"
    });

    if (err instanceof AppError) {
        errLogger.error(
            { error: { ...err, stack: `${err.stack}` } },
            `${err.moreInformation || err.httpMessage} - Exception caught`
        );
       res.status(err.httpCode).json({httpMessage: err.httpMessage, moreInformation:err.moreInformation});
    } else {
        // If error is not of type AppError
        errLogger.error(
            { error: { name: err.name, stack: `${err.stack}` } },
            `Unhandled_Error - ${err.toString()}`
        );
        res.status(500).json({moreInformation:`Unhandled_Error - ${err.toString()}`});
    }
};
