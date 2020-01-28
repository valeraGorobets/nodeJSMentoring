import * as express from 'express';
import { createValidator, ExpressJoiInstance, ValidatedRequest } from 'express-joi-validation';
import { CONFIG } from './config';
import { UserGroupDBAccessService } from './data-access/userGroupDBAccess.service';
import { IGroup } from './models/group.model';
import {
	buildAuthenticationSchema,
	groupValidationSchema,
	usersValidationSchema,
	IRequestSchema,
	userGroupValidationSchema
} from './models/schemas';
import { IUserGroup } from './models/user-group.model';
import { IUser } from './models/users.model';
import { GroupsService } from './services/groups.service';
import { UsersService } from './services/users.service';

const usersService: UsersService = new UsersService();
const groupsService: GroupsService = new GroupsService();
const userGroupService: UserGroupDBAccessService = new UserGroupDBAccessService();

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
app.post('/create', validator.body(usersValidationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
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
app.post('/update', validator.body(usersValidationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
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

// GET: http://localhost:3000/group/5e302881b7399b82ffe394c1
app.get('/group/:id', async (req, res) => {
	const id: string = req.params.id;
	const group: IGroup = await groupsService.getGroupById(id);
	res.send(group || `Cant find group with id: ${id}`);
});

// GET: http://localhost:3000/getAllGroups
app.get('/getAllGroups', async (req, res) => {
	const groups: IGroup[] = await groupsService.getAllGroups();
	res.send(groups);
});

// DELETE: http://localhost:3000/group/5e302881b7399b82ffe394c1
app.delete('/group/:id', async (req, res) => {
	const id = req.params.id;
	const result = await groupsService.deleteGroupById(id);
	res.send(`Group ${id} is deleted`);
});

// POST: http://localhost:3000/createGroup
// Body:
// {
// 	"id": "qwerty123",
// 	"name": "newGroupName",
// 	"permissions": ["READ", "WRITE"]
// }
app.post('/createGroup', validator.body(groupValidationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
	const newGroup: IGroup = req.body;
	const result: boolean = await groupsService.createGroup(newGroup);
	result ?
		res.send(`New group with id: ${newGroup.id} added.`) :
		res.send(`Group with id: ${newGroup.id} already exists, use "POST: update" method to modify it.`);
});

// POST: http://localhost:3000/updateGroup
// Body: updated name
// {
// 	"id": "5e302881630cd0a07b978220",
// 	"name": "Developers",
// 	"permissions": [
// 	"READ",
// 	"WRITE",
// 	"DELETE",
// 	"SHARE"
// ]
// }
app.post('/updateGroup', validator.body(groupValidationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
	const updatedGroup: IGroup = req.body;
	await groupsService.updateGroup(updatedGroup);
	res.send(`Group with id: ${updatedGroup.id} updated`);
});

// POST: http://localhost:3000/addUsersToGroup
// Body:
// {
// 	"id": "5e302881630cd0a07b978220",
// 	"name": "Developers",
// 	"permissions": [
// 	"READ",
// 	"WRITE",
// 	"DELETE",
// 	"SHARE"
// ]
// }
app.post('/addUsersToGroup', validator.body(userGroupValidationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
	const userGroup: IUserGroup = req.body;
	await userGroupService.addUsersToGroup(userGroup);
	res.send(`Added users to group`);
});

app.listen(port, () => console.log(`Users API listening on port ${port}!`));
