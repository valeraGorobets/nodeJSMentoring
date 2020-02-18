import * as express from 'express';
import { createValidator, ExpressJoiInstance, ValidatedRequest } from 'express-joi-validation';
import { CONFIG } from './config';
import { errorLogger, handleError, logger, winstonErrorMessage } from './error-handling';
import { IGroup } from './models/group.model';
import {
	buildAuthenticationSchema,
	groupValidationSchema,
	usersValidationSchema,
	userGroupValidationSchema,
	IRequestSchema
} from './models/schemas';
import { IUserGroup } from './models/user-group.model';
import { IUser } from './models/users.model';
import { GroupsService } from './services/groups.service';
import { UserGroupService } from './services/users-group.service';
import { UsersService } from './services/users.service';

const usersService: UsersService = new UsersService();
const groupsService: GroupsService = new GroupsService();
const userGroupService: UserGroupService = new UserGroupService();

const app = express();
const port: number = CONFIG.port;
const validator: ExpressJoiInstance = createValidator();

app.use(express.json());

const router = express.Router();
router.get('/', (req, res) => res.send('Hello World!'));

// GET: http://localhost:3000/user/5df5e546789efb5bdb39fa99
router.get('/user/:id', async (req, res) => {
	try {
		const id: string = req.params.id;
		const user: IUser = await usersService.getUserById(id);
		if (user) {
			res.send(user);
		} else {
			handleError(`Cant find user with id: ${id}`, res);
		}
	} catch (e) {
		handleError(e.message, res, 500);
	}
});

// GET: http://localhost:3000/getAutoSuggestUsers/?loginSubstring=ey&limit=2
router.get('/getAutoSuggestUsers', async (req, res) => {
	try {
		const { loginSubstring, limit } = req.query;
		const users = await usersService.getAutoSuggestUsers(loginSubstring, limit);
		res.send(users);
	} catch (e) {
		handleError(e.message, res, 500);
	}
});

// DELETE: http://localhost:3000/user/5df5e546789efb5bdb39fa99
router.delete('/user/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const result = await usersService.deleteUserByID(id);
		await userGroupService.deleteUserFromGroup(id);
		if (result) {
			res.send(`User ${id} is deleted`);
		} else {
			handleError(`Cant delete user with id: ${id}`, res);
		}
	} catch (e) {
		handleError(e.message, res, 500);
	}
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
router.post('/create', validator.body(usersValidationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
	try {
		const newUser: IUser = req.body;
		const result: boolean = await usersService.createUser(newUser);
		if (result) {
			res.send(`New user with id: ${newUser.id} added.`);
		} else {
			handleError(`User with id: ${newUser.id} already exists, use "POST: update" method to modify it.`, res);
		}
	} catch (e) {
		handleError(e.message, res, 500);
	}
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
router.post('/update', validator.body(usersValidationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
	try {
		const updatedUser: IUser = req.body;
		const storedUser: IUser = await usersService.getUserById(updatedUser.id);
		const { error } = buildAuthenticationSchema(storedUser.login, storedUser.password).validate(updatedUser, { allowUnknown: true });
		if (error) {
			handleError('Wrong login or password!', res, 400);
		} else {
			await usersService.updateUser(updatedUser);
			res.send(`User with id: ${updatedUser.id} updated`);
		}
	} catch (e) {
		handleError(e.message, res, 500);
	}
});

// GET: http://localhost:3000/group/5e302881b7399b82ffe394c1
router.get('/group/:id', async (req, res) => {
	try {
		const id: string = req.params.id;
		const group: IGroup = await groupsService.getGroupById(id);
		if (group) {
			res.send(group);
		} else {
			handleError(`Cant find group with id: ${id}`, res);
		}
	} catch (e) {
		handleError(e.message, res, 500);
	}
});

// GET: http://localhost:3000/getAllGroups
router.get('/getAllGroups', async (req, res) => {
	try {
		const groups: IGroup[] = await groupsService.getAllGroups();
		res.send(groups);
	} catch (e) {
		handleError(e.message, res, 500);
	}
});

// DELETE: http://localhost:3000/group/5e302881b7399b82ffe394c1
router.delete('/group/:id', async (req, res) => {
	try {
		const id = req.params.id;
		await groupsService.deleteGroupById(id);
		res.send(`Group ${id} is deleted`);
	} catch (e) {
		handleError(e.message, res, 500);
	}
});

// POST: http://localhost:3000/createGroup
// Body:
// {
// 	"id": "qwerty123",
// 	"name": "newGroupName",
// 	"permissions": ["READ", "WRITE"]
// }
router.post('/createGroup', validator.body(groupValidationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
	try {
		const newGroup: IGroup = req.body;
		const result: boolean = await groupsService.createGroup(newGroup);
		if (result) {
			res.send(`New group with id: ${newGroup.id} added.`);
		} else {
			handleError(`Group with id: ${newGroup.id} already exists, use "POST: update" method to modify it.`, res);
		}
	} catch (e) {
		handleError(e.message, res, 500);
	}
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
router.post('/updateGroup', validator.body(groupValidationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
	try {
		const updatedGroup: IGroup = req.body;
		await groupsService.updateGroup(updatedGroup);
		res.send(`Group with id: ${updatedGroup.id} updated`);
	} catch (e) {
		handleError(e.message, res, 500);
	}
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
router.post('/addUsersToGroup', validator.body(userGroupValidationSchema), async (req: ValidatedRequest<IRequestSchema>, res) => {
	try {
		const userGroup: IUserGroup = req.body;
		await userGroupService.addUsersToGroup(userGroup);
		res.send(`Added users to group`);
	} catch (e) {
		handleError(e.message, res, 500);
	}
});

app.use(logger);
app.use(router);
app.use(errorLogger);

process.on('unhandledRejection', (err: any) => {
	winstonErrorMessage(err.message);
	throw err;
});

app.use((err, req, res) => {
	handleError(err, res, 500);
});

app.listen(port, () => console.log(`Users API listening on port ${port}!`));
