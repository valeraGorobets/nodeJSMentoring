import { UsersDBAccessService } from '../data-access/usersDBAccess.service';

export class UsersService {
	constructor() {
		this.db = new UsersDBAccessService();
	}

	getUserById(id) {
		return this.db.getUserById(id);
	}

	getAutoSuggestUsers(loginSubstring, limit) {
		return this.db.getAutoSuggestUsers(loginSubstring, limit);
	}

	async deleteUserByID(id) {
		const user = await this.getUserById(id);
		if (user && user.isdeleted === false) {
			await this.db.deleteUserById(id);
			return true;
		}
		return false;
	}

	async createUser(newUser) {
		const storedUser = await this.getUserById(newUser.id);
		if (!storedUser) {
			await this.db.createUser(newUser);
			return true;
		} else {
			return false;
		}
	}

	async updateUser(newUser) {
		this.db.updateUser(newUser);
	}
}
