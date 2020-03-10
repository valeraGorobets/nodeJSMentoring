import * as expressWinston from 'express-winston';
import * as winston from 'winston';

export function winstonErrorMessage(errorMessage) {
	winston.error(errorMessage);
}

export function handleError(errorMessage, res, status = 400) {
	res.status(status).send(errorMessage);
	winstonErrorMessage(errorMessage);
}

export const logger = expressWinston.logger({
	transports: [
		new winston.transports.Console(),
	],
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.json(),
	),
});

export const errorLogger = expressWinston.errorLogger({
	transports: [
		new winston.transports.Console(),
	],
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.json(),
	),
});
