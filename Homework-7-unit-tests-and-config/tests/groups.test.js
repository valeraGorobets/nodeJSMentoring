import { GroupsService } from '../services/groups.service';
import { GroupsDBAccessService } from '../data-access/groupsDBAccess.service';

let groupsService, mockedFn;
const ALL_GROUPS = [{
	'id': '5e3028810a9ed35d08655637',
	'name': 'Admins',
	'permissions': [
		'READ',
		'WRITE',
		'DELETE',
		'SHARE',
		'UPLOAD_FILES'
	]
}, {
	'id': '5e302881630cd0a07b978220',
	'name': 'Developers',
	'permissions': [
		'READ',
		'WRITE',
		'DELETE',
		'SHARE'
	]
}];

beforeAll(() => {
	groupsService = new GroupsService();
	mockedFn = jest.fn();
});

describe('Getting Groups', () => {
	test('getGroupById should return proper group by id', async () => {
		const expectedGroup = {
			'id': '5e3028810a9ed35d08655637',
			'name': 'Admins',
			'permissions': [
				'READ',
				'WRITE',
				'DELETE',
				'SHARE',
				'UPLOAD_FILES'
			]
		};

		GroupsDBAccessService.prototype.getGroupById = mockedFn;
		mockedFn.mockReturnValue(Promise.resolve(expectedGroup));

		const result = await groupsService.getGroupById('5e3028810a9ed35d08655637');

		expect(result.name).toBe('Admins');
	});

	test('getAllGroups should return all available groups', async () => {
		GroupsDBAccessService.prototype.getAllGroups = mockedFn;
		mockedFn.mockReturnValue(Promise.resolve(ALL_GROUPS));

		const result = await groupsService.getAllGroups();

		expect(result.length).toBe(2);
		expect(result[1].name).toBe('Developers');
	});
});

describe('Modifying Groups', () => {
	test('createGroup should add a new group', async () => {
		const createdGroup = {
			'id': 'qwerty123',
			'name': 'newGroupName',
			'permissions': ['READ', 'WRITE']
		};

		const createGroupFn = jest.fn();

		GroupsDBAccessService.prototype.getGroupById = mockedFn;
		mockedFn.mockReturnValue(Promise.resolve(null));

		GroupsDBAccessService.prototype.createGroup = createGroupFn;
		createGroupFn.mockReturnValue(Promise.resolve(true));

		const result = await groupsService.createGroup(createdGroup);

		expect(result).toBeTruthy();
	});

	test('updateUser should change users props', async () => {
		const group = {
			'id': 'qwerty123',
			'name': 'newGroupName',
			'permissions': ['READ', 'WRITE']
		};
		const updatedGroup = {
			'id': 'qwerty123',
			'name': 'updatedName',
			'permissions': ['READ', 'WRITE', 'SHARE']
		};

		const updateGroupFn = jest.fn();

		GroupsDBAccessService.prototype.updateGroup = updateGroupFn;
		updateGroupFn.mockReturnValue(Promise.resolve());

		GroupsDBAccessService.prototype.getGroupById = mockedFn;
		mockedFn.mockReturnValue(Promise.resolve(updatedGroup));

		await groupsService.updateGroup(updatedGroup);
		const groupAfter = await groupsService.getGroupById('qwerty123');

		expect(groupAfter.id).toBe(group.id);
		expect(groupAfter).toEqual(updatedGroup);
		expect(groupAfter.name).toBe('updatedName');
		expect(groupAfter.permissions).toContain('SHARE');
	});

	test('deleteGroupById should delete group', async () => {
		const idToDelete = '5e3028810a9ed35d08655637';
		const deleteGroupByIdFn = jest.fn();
		GroupsDBAccessService.prototype.getAllGroups = mockedFn;
		mockedFn.mockReturnValue(Promise.resolve(ALL_GROUPS));

		GroupsDBAccessService.prototype.deleteGroupById = deleteGroupByIdFn;
		deleteGroupByIdFn.mockReturnValue(Promise.resolve(ALL_GROUPS.filter(group => group.id !== idToDelete)));

		const groupsBefore = await groupsService.getAllGroups();
		const result = await groupsService.deleteGroupById(idToDelete);

		expect(groupsBefore.length).toBe(2);
		expect(result.length).toBe(1);
	});
});
