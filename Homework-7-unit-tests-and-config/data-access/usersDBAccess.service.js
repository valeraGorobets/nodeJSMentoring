import { Client } from 'pg';

const DB_URL = process.env.DB_URL;

export class UsersDBAccessService {
	constructor() {
		this.client = new Client(DB_URL);
		this.client.connect();
	}

	async getUserById(id) {
		const request = `
			SELECT * FROM Users
			WHERE id=$1;
		`;
		const response = await this.client.query(request, [id]);
		return response && response.rows[0];
	}

	async getAutoSuggestUsers(loginSubstring, limit) {
		const request = `
			SELECT * FROM Users
			WHERE login
			LIKE '%${loginSubstring}%'
			LIMIT $1;
		`;
		const response = await this.client.query(request, [limit]);
		return response && response.rows;
	}

	deleteUserById(id) {
		const request = `
			UPDATE Users
			SET isdeleted=true
			WHERE id=$1;
		`;
		return this.client.query(request, [id]);
	}

	createUser({ id, login, password, age }) {
		const request = `
			INSERT INTO Users(id,login,password,age,isDeleted)
			VALUES($1,$2,$3,$4,false);
		`;
		return this.client.query(request, [id, login, password, age]);
	}

	updateUser({ id, login, password, age, isdeleted }) {
		const request = `
			UPDATE Users
			SET login = $2,
				password = $3,
				age = $4,
				isdeleted = $5
			WHERE id = $1;
		`;
		return this.client.query(request, [id, login, password, age, isdeleted]);
	}
}
