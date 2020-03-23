import { UsersService } from '../services/users.service';
import { UsersDBAccessService } from '../data-access/usersDBAccess.service';

let usersService, mockedFn;
beforeAll(() => {
	usersService = new UsersService();
	mockedFn = jest.fn();
});
describe('Getting Users', () => {
	test('getUserById should return proper user by id', async () => {
		const expectedUser = {
			'id': '5df5e5465ab9be5e03a551ad',
			'login': 'DaughertyOwens',
			'password': 'o55cl8qymy',
			'age': 110,
			'isDeleted': false
		};

		UsersDBAccessService.prototype.getUserById = mockedFn;
		mockedFn.mockReturnValue(Promise.resolve(expectedUser));

		const result = await usersService.getUserById('5df5e5465ab9be5e03a551ad');

		expect(result.login).toBe('DaughertyOwens');
		expect(result.age).toBe(110);
	});

	test('getAutoSuggestUsers should return proper users set by login substring', async () => {
		const expectedUsers = [{
			"id": "5df5e54678aee81a069ac231",
			"login": "ReynoldsSheppard",
			"password": "bx8t9m8ia84",
			"age": 44,
			"isDeleted": false
		}, {
			"id": "5df5e546371b2c4468b775b2",
			"login": "McintyreHoover",
			"password": "9a18rheo0y9",
			"age": 74,
			"isDeleted": false
		}];
		UsersDBAccessService.prototype.getAutoSuggestUsers = mockedFn;
		mockedFn.mockReturnValue(Promise.resolve(expectedUsers));

		const result = await usersService.getAutoSuggestUsers('re');

		expect(result.length).toBe(2);
		expect(result[0].login).toBe('ReynoldsSheppard');
	});
});

describe('Modifying Users', () => {
	test('createUser should add a new user', async () => {
		const createdUser = {
			'id': '5df5e5465ab9be5e03a551yu234',
			'login': 'New User',
			'password': 'o55cl8qymy',
			'age': 60,
			'isDeleted': false
		};
		const createUserFn = jest.fn();

		UsersDBAccessService.prototype.getUserById = mockedFn;
		mockedFn.mockReturnValue(Promise.resolve(null));

		UsersDBAccessService.prototype.createUser = createUserFn;
		createUserFn.mockReturnValue(Promise.resolve(true));

		const result = await usersService.createUser(createdUser);

		expect(result).toBeTruthy();
	});

	test('updateUser should change users props', async () => {
		const user = {
			'id': '5df5e5465ab9be5e03a551yu',
			'login': 'New User',
			'password': 'o55cl8qymy',
			'age': 60,
			'isDeleted': false
		};
		const updatedUser = {
			'id': '5df5e5465ab9be5e03a551yu',
			'login': 'New User',
			'password': 'o55cl8qymy',
			'age': 80,
			'isDeleted': true
		};

		const updateUserFn = jest.fn();

		UsersDBAccessService.prototype.getUserById = mockedFn;
		mockedFn.mockReturnValue(Promise.resolve(updatedUser));

		UsersDBAccessService.prototype.updateUser = updateUserFn;
		updateUserFn.mockReturnValue(Promise.resolve());

		await usersService.updateUser(updatedUser);
		const userAfter = await usersService.getUserById('5df5e5465ab9be5e03a551yu');

		expect(userAfter.login).toBe(user.login);
		expect(userAfter).toEqual(updatedUser);
		expect(userAfter.age).toBe(80);
		expect(userAfter.isDeleted).toBeTruthy();
	});

	test('deleteUserById should change isDeleted prop', async () => {
		const user = {
			'id': '5df5e5465ab9be5e03a551yu',
			'login': 'New User',
			'password': 'o55cl8qymy',
			'age': 60,
			'isDeleted': false
		};
		const updatedUser = {
			'id': '5df5e5465ab9be5e03a551yu',
			'login': 'New User',
			'password': 'o55cl8qymy',
			'age': 60,
			'isDeleted': true
		};

		UsersDBAccessService.prototype.getUserById = mockedFn;
		mockedFn.mockReturnValue(Promise.resolve(user));

		UsersDBAccessService.prototype.deleteUserById = mockedFn;
		mockedFn.mockReturnValue(Promise.resolve(updatedUser));

		const userBefore = await usersService.getUserById('5df5e5465ab9be5e03a551yu');
		const result = await usersService.getUserById(updatedUser);

		expect(userBefore.login).toBe(updatedUser.login);
		expect(result.isDeleted).toBeTruthy();
	});
});
