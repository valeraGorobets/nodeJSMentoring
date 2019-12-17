import * as Joi from '@hapi/joi';
import * as express from 'express';
import { createValidator, ExpressJoiInstance, ValidatedRequest } from 'express-joi-validation';
import { IUser } from "./users.model";
import { HelloRequestSchema, querySchema } from "./schemas";

const USERS: IUser[] = require('./users-list.json');

const app = express();
const port: number = 3000;
const validator: ExpressJoiInstance = createValidator();

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/user/:id', (req, res) => {
	const id: string = req.params.id;
	const user: IUser = USERS.find((user: IUser) => user.id === id);
	res.send(user || `Cant find user with id: ${id}`);
});

app.get('/getAutoSuggestUsers', (req, res) => {
	const { loginSubstring = '', limit = 10 } = req.query;
	// res.json({ loginSubstring, limit, params: req.query });
	res.send(USERS.filter((user: IUser) => user.login.toLowerCase().includes(loginSubstring.toLowerCase())).slice(0, limit));
});

app.delete('/user/:id',(req, res) => {
	const id = req.params.id;
	const userToDelete: IUser = USERS.find(user => user.id === id);
	userToDelete.isDeleted = true;
	res.send(userToDelete ?
		`User ${id} is deleted` :
		`Cant delete user with id: ${id}`);
});

app.get(
	'/hello',
	validator.query(querySchema),
	(req: ValidatedRequest<HelloRequestSchema>, res) => {
		// Woohoo, type safety and intellisense for req.query!
		res.end(`Hello ${req.query.name}!`)
	}
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//[
//  {
//    'repeat(20)': {
//      id: '{{objectId()}}',
//      login: '{{firstName()}}{{surname()}}',
//      password() {
//  return Math.random().toString(36).slice(2);
//},
//  age: '{{integer(5, 150)}}',
//  isDelited: false,
//  }
//}
//]
