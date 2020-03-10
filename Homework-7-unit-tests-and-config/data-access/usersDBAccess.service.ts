import { Client } from 'pg';
import { IUser } from '../models/users.model';

const DB_URL: string = process.env.DB_URL;

export class UsersDBAccessService {
	private client = new Client(DB_URL);

	constructor() {
		this.client.connect();
	}

	public async getUserById(id: string): Promise<IUser> {
		const request: string = `
			SELECT * FROM Users
			WHERE id=$1;
		`;
		const response = await this.client.query(request, [id]);
		return response && response.rows[0];
	}

	public async getAutoSuggestUsers(loginSubstring: string = '', limit: number = 10) {
		const request: string = `
			SELECT * FROM Users
			WHERE login
			LIKE '%${loginSubstring}%'
			LIMIT $1;
		`;
		const response = await this.client.query(request, [limit]);
		return response && response.rows;
	}

	public deleteUserById(id: string) {
		const request: string = `
			UPDATE Users
			SET isdeleted=true
			WHERE id=$1;
		`;
		return this.client.query(request, [id]);
	}

	public createUser({ id, login, password, age }: IUser) {
		const request: string = `
			INSERT INTO Users(id,login,password,age,isDeleted)
			VALUES($1,$2,$3,$4,false);
		`;
		return this.client.query(request, [id, login, password, age]);
	}

	public updateUser({ id, login, password, age, isdeleted }: IUser) {
		const request: string = `
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
