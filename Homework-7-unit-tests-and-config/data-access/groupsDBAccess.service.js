import { Client } from 'pg';

const DB_URL = process.env.DB_URL;

export class GroupsDBAccessService {
	constructor() {
		this.client = new Client(DB_URL);
		this.client.connect();
	}

	async getGroupById(id) {
		const request = `
			SELECT * FROM Groups
			WHERE id=$1;
		`;
		const response = await this.client.query(request, [id]);
		return response && response.rows[0];
	}

	async getAllGroups() {
		const request = `
			SELECT * FROM Groups;
		`;
		const response = await this.client.query(request);
		return response && response.rows;
	}

	deleteGroupById(id) {
		const request = `
			DELETE FROM Groups
			WHERE id=$1;
		`;
		return this.client.query(request, [id]);
	}

	createGroup({ id, name, permissions }) {
		const request = `
			INSERT INTO Groups(id,name,permissions)
			VALUES($1,$2,$3);
		`;
		return this.client.query(request, [id, name, permissions]);
	}

	updateGroup({ id, name, permissions }) {
		const request = `
			UPDATE Groups
			SET name = $2,
				permissions = $3
			WHERE id = $1;
		`;
		return this.client.query(request, [id, name, permissions]);
	}
}
