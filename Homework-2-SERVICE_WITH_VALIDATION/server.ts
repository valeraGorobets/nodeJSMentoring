import * as express from 'express';
import { createValidator, ExpressJoiInstance, ValidatedRequest } from 'express-joi-validation';
import { buildAuthenticationSchema, validationSchema, IRequestSchema } from './schemas';
import { IUser } from './users.model';

let USERS: IUser[] = require('./users-list.json');

const app = express();
const port: number = 3000;
const validator: ExpressJoiInstance = createValidator();

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));

// GET: http://localhost:3000/user/5df5e546789efb5bdb39fa99
app.get('/user/:id', (req, res) => {
	const id: string = req.params.id;
	const user: IUser = USERS.find((user: IUser) => user.id === id);
	res.send(user || `Cant find user with id: ${id}`);
});

// GET: http://localhost:3000/getAutoSuggestUsers/?loginSubstring=ey&limit=2
app.get('/getAutoSuggestUsers', (req, res) => {
	const { loginSubstring = '', limit = 10 } = req.query;
	// res.json({ loginSubstring, limit, params: req.query });
	res.send(USERS.filter((user: IUser) => user.login.toLowerCase().includes(loginSubstring.toLowerCase())).slice(0, limit));
});

// DELETE: http://localhost:3000/user/5df5e546789efb5bdb39fa99
app.delete('/user/:id', (req, res) => {
	const id = req.params.id;
	const userToDelete: IUser = USERS.find(user => user.id === id);
	userToDelete.isDeleted = true;
	res.send(userToDelete ?
		`User ${id} is deleted` :
		`Cant delete user with id: ${id}`);
});

// POST: http://localhost:3000/create
// Body:
// {
// 	"id": "qwerty123",
// 	"login": "valera",
// 	"password": "hello1234",
// 	"age": 45,
// 	"isDeleted": false
// }
app.post('/create', validator.body(validationSchema), (req: ValidatedRequest<IRequestSchema>, res) => {
		const newUser: IUser = req.body;
		const storedUser: IUser = USERS.find((user: IUser) => user.id === newUser.id);
		if (!storedUser) {
			USERS.push(newUser);
			res.send(`New user with id: ${newUser.id} added.`);
		} else {
			res.send(`User with id: ${newUser.id} already exists, use "POST: update" method to modify it.`);
		}
	},
);

// POST: http://localhost:3000/update
// Body: updated age
// {
// 	"id": "5df5e546789efb5bdb39fa99",
// 	"login": "DianaBenjamin",
// 	"password": "ljp39bpboq",
// 	"age": 39,
// 	"isDeleted": false
// }
app.post('/update', validator.body(validationSchema), (req: ValidatedRequest<IRequestSchema>, res) => {
		const updatedUser: IUser = req.body;
		const storedUser: IUser = USERS.find((user: IUser) => user.id === updatedUser.id);
		const { error } = buildAuthenticationSchema(storedUser.login, storedUser.password).validate(updatedUser, {allowUnknown: true});
		if (error) {
			res.status(400).send('Wrong login or password!');
		} else {
			USERS = USERS.map((user: IUser) => user.id === updatedUser.id ? updatedUser : user);
			res.send(`User with id: ${updatedUser.id} updated`);
		}
	},
);

app.listen(port, () => console.log(`Users API listening on port ${port}!`));
