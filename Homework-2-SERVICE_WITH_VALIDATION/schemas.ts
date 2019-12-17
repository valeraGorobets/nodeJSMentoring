import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import * as Joi from "@hapi/joi";

export interface HelloRequestSchema extends ValidatedRequestSchema {
	[ContainerTypes.Query]: {
		name: string
	}
}

export const querySchema = Joi.object({
	name: Joi.string().required()
});
