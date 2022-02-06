/**
 * Genralised Error definitions for consistent error hamdling
 */
import {
    StatusCodes,
    getReasonPhrase
} from 'http-status-codes';

export abstract class AppError extends Error {
    readonly httpCode!: number;
    readonly httpMessage!: string;
    readonly moreInformation!: string;
    public innerException!: any;

    constructor(name: string, moreInformation?: string, innerException?: any) {
        super(name);
        Error.captureStackTrace(this, this.constructor);
        this.httpMessage = this.constructor.name;
        this.moreInformation = moreInformation;
        this.innerException = innerException ? innerException : {};
    }
}

export class BadRequestError extends AppError {
    httpCode = StatusCodes.BAD_REQUEST;
    constructor(moreInformation?: string, innerException?: any) {
        super(getReasonPhrase(StatusCodes.BAD_REQUEST), moreInformation, innerException)
    }
}

export class UnauthorisedError extends AppError {
    httpCode = StatusCodes.UNAUTHORIZED;
    constructor(moreInformation?: string, innerException?: any) {
        super(getReasonPhrase(StatusCodes.UNAUTHORIZED), moreInformation, innerException)
    }
}

export class ForbiddenError extends AppError {
    httpCode = StatusCodes.FORBIDDEN;
    constructor(moreInformation?: string, innerException?: any) {
        super(getReasonPhrase(StatusCodes.FORBIDDEN), moreInformation, innerException)
    }
}

export class NotFoundError extends AppError {
    httpCode = StatusCodes.NOT_FOUND;
    constructor(moreInformation?: string, innerException?: any) {
        super(getReasonPhrase(StatusCodes.NOT_FOUND), moreInformation, innerException)
    }
}

export class UnprocessableEntityError extends AppError {
    httpCode = StatusCodes.UNPROCESSABLE_ENTITY;
    constructor(moreInformation?: string, innerException?: any) {
        super(getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY), moreInformation, innerException)
    }
}

export class ServerError extends AppError {
    httpCode = StatusCodes.INTERNAL_SERVER_ERROR;
    constructor(moreInformation?: string, innerException?: any) {
        super(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR), moreInformation, innerException)
    }
}