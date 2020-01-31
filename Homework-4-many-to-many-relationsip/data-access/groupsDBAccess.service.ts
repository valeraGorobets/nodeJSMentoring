import { Client } from 'pg';
import { CONFIG } from '../config';
import { IGroup } from '../models/group.model';

const DB_URL: string = CONFIG.databaseURL;

export class GroupsDBAccessService {
	private client = new Client(DB_URL);

	constructor() {
		this.client.connect();
	}

	public async getGroupById(id: string): Promise<IGroup> {
		const request: string = `
			SELECT * FROM Groups
			WHERE id=$1;
		`;
		const response = await this.client.query(request, [id]);
		return response && response.rows[0];
	}

	public async getAllGroups(): Promise<IGroup[]> {
		const request: string = `
			SELECT * FROM Groups;
		`;
		const response = await this.client.query(request);
		return response && response.rows;
	}

	public deleteGroupById(id: string) {
		const request: string = `
			DELETE FROM Groups
			WHERE id=$1;
		`;
		return this.client.query(request, [id]);
	}

	public createGroup({ id, name, permissions }: IGroup) {
		const request: string = `
			INSERT INTO Groups(id,name,permissions)
			VALUES($1,$2,$3);
		`;
		return this.client.query(request, [id, name, permissions]);
	}

	public updateGroup({ id, name, permissions }: IGroup) {
		const request: string = `
			UPDATE Groups
			SET name = $2,
				permissions = $3
			WHERE id = $1;
		`;
		return this.client.query(request, [id, name, permissions]);
	}
}
