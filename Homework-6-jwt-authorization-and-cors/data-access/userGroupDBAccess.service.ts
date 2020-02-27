import { Client } from 'pg';
import { CONFIG } from '../config';
import { IUserGroup } from '../models/user-group.model';
import { IUser } from '../models/users.model';

const DB_URL: string = CONFIG.databaseURL;

export class UserGroupDBAccessService {
	private client = new Client(DB_URL);

	constructor() {
		this.client.connect();
	}

	public async addUsersToGroup({ groupId, userIds }: IUserGroup): Promise<IUser> {
		const request: string = `
			insert into UserGroup (group_id, user_id)
			${userIds.map(userId => `values('${groupId}', '${userId}')`).join(',')};
		`;
		const response = await this.client.query(request);
		return response && response.rows[0];
	}

	public deleteUserFromGroup(userId: string) {
		const request: string = `
			DELETE FROM UserGroup
			WHERE user_id=$1;
		`;
		return this.client.query(request, [userId]);
	}
}
