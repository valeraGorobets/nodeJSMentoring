import { UserGroupDBAccessService } from '../data-access/userGroupDBAccess.service';
import { IUserGroup } from '../models/user-group.model';

export class UserGroupService {
	private db: UserGroupDBAccessService = new UserGroupDBAccessService();

	public addUsersToGroup(userGroup: IUserGroup) {
		return this.db.addUsersToGroup(userGroup);
	}

	public deleteUserFromGroup(userId: string) {
		return this.db.deleteUserFromGroup(userId);
	}
}
