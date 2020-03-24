import * as Joi from '@hapi/joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import { IUser } from './users.model';

export interface IRequestSchema extends ValidatedRequestSchema {
	[ContainerTypes.Query]: IUser;
}

export const usersValidationSchema = Joi.object({
	id: Joi.string().required(),
	login: Joi.string().required(),
	password: Joi.string().required().regex(/[a-zA-Z]+/).regex(/[0-9]+/),
	age: Joi.number().required().min(4).max(130),
	isdeleted: Joi.boolean().required(),
});

export const groupValidationSchema = Joi.object({
	id: Joi.string().required(),
	name: Joi.string().required(),
	permissions: Joi.array().items(Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')),
});

export const userGroupValidationSchema = Joi.object({
	groupId: Joi.string().required(),
	userIds: Joi.array().required(),
});

export function buildAuthenticationSchema(login, password) {
	return Joi.object({
		login: Joi.string().equal(login),
		password: Joi.string().equal(password),
	});
}
