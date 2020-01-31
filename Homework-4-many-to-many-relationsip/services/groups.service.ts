import { GroupsDBAccessService } from '../data-access/groupsDBAccess.service';
import { IGroup } from '../models/group.model';

export class GroupsService {
	private db: GroupsDBAccessService = new GroupsDBAccessService();

	public getGroupById(id: string): Promise<IGroup> {
		return this.db.getGroupById(id);
	}

	public getAllGroups(): Promise<IGroup[]> {
		return this.db.getAllGroups();
	}

	public deleteGroupById(id: string) {
		return this.db.deleteGroupById(id);
	}

	public async createGroup(newGroup: IGroup): Promise<boolean> {
		const storedGroup: IGroup = await this.getGroupById(newGroup.id);
		if (!storedGroup) {
			await this.db.createGroup(newGroup);
			return true;
		} else {
			return false;
		}
	}

	public async updateGroup(newGroup: IGroup): Promise<void> {
		this.db.updateGroup(newGroup);
	}
}
