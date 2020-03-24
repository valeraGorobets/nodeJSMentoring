import { GroupsDBAccessService } from '../data-access/groupsDBAccess.service';

export class GroupsService {
	constructor() {
		this.db = new GroupsDBAccessService();
	}

	getGroupById(id) {
		return this.db.getGroupById(id);
	}

	getAllGroups() {
		return this.db.getAllGroups();
	}

	deleteGroupById(id) {
		return this.db.deleteGroupById(id);
	}

	async createGroup(newGroup) {
		const storedGroup = await this.getGroupById(newGroup.id);
		if (!storedGroup) {
			await this.db.createGroup(newGroup);
			return true;
		} else {
			return false;
		}
	}

	async updateGroup(newGroup) {
		this.db.updateGroup(newGroup);
	}
}
