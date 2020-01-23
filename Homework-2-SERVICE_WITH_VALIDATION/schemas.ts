import * as Joi from '@hapi/joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { IUser } from './users.model';

export interface IRequestSchema extends ValidatedRequestSchema {
	[ContainerTypes.Query]: IUser;
}

export const validationSchema = Joi.object({
	id: Joi.string().required(),
	login: Joi.string().required(),
	password: Joi.string().required().regex(/[a-zA-Z]+/).regex(/[0-9]+/),
	age: Joi.number().required().min(4).max(130),
	isDeleted: Joi.boolean().required(),
});

export function buildAuthenticationSchema(login, password) {
	return Joi.object({
		login: Joi.string().equal(login),
		password: Joi.string().equal(password),
	});
}
