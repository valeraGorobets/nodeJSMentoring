import * as express from 'express';
import { createValidator, ExpressJoiInstance, ValidatedRequest } from 'express-joi-validation';
import { CONFIG } from './config';
import { buildAuthenticationSchema, validationSchema, IRequestSchema } from './models/schemas';
import { IUser } from './models/users.model';
import { UsersService } from './services/users.service';

const usersService: UsersService = new UsersService();

const app = express();
const port: number = CONFIG.port;
const validator: ExpressJoiInstance = createValidator();

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));

// GET: http://localhost:3000/user/5df5e546789efb5bdb39fa99
app.get('/user/:id', async (req, res) => {
	const id: string = req.params.id;
	const user: IUser = await usersService.getUserById(id);
	res.send(user || `Cant find user with id: ${id}`);
});

// GET: http://localhost:3000/getAutoSuggestUsers/?loginSubstring=ey&limit=2
app.get('/getAutoSuggestUsers', async (req, res) => {
	const { loginSubstring, limit } = req.query;
	const users = await usersService.getAutoSuggestUsers(loginSubstring, limit);
	res.send(users);
});

// DELETE: http://localhost:3000/user/5df5e546789efb5bdb39fa99
app.delete('/user/:id', async (req, res) => {
	const id = req.params.id;
	const result = await usersService.deleteUserByID(id);
	res.send(result ?
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
// 	"isdeleted": false
// }
app.post('/create', validator.body(validationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
	const newUser: IUser = req.body;
	const result: boolean = await usersService.createUser(newUser);
	result ?
		res.send(`New user with id: ${newUser.id} added.`) :
		res.send(`User with id: ${newUser.id} already exists, use "POST: update" method to modify it.`);
});

// POST: http://localhost:3000/update
// Body: updated age
// {
// 	"id": "5df5e546789efb5bdb39fa99",
// 	"login": "DianaBenjamin",
// 	"password": "ljp39bpboq",
// 	"age": 39,
// 	"isdeleted": false
// }
app.post('/update', validator.body(validationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
	const updatedUser: IUser = req.body;
	const storedUser: IUser = await usersService.getUserById(updatedUser.id);
	const { error } = buildAuthenticationSchema(storedUser.login, storedUser.password).validate(updatedUser, { allowUnknown: true });
	if (error) {
		res.status(400).send('Wrong login or password!');
	} else {
		await usersService.updateUser(updatedUser);
		res.send(`User with id: ${updatedUser.id} updated`);
	}
});

app.listen(port, () => console.log(`Users API listening on port ${port}!`));
