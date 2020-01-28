import { UsersDBAccessService } from '../data-access/usersDBAccess.service';
import { IUser } from '../models/users.model';

export class UsersService {
	private db: UsersDBAccessService = new UsersDBAccessService();

	public getUserById(id: string): Promise<IUser> {
		return this.db.getUserById(id);
	}

	public getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<IUser[]> {
		return this.db.getAutoSuggestUsers(loginSubstring, limit);
	}

	public async deleteUserByID(id: string): Promise<boolean> {
		const user: IUser = await this.getUserById(id);
		if (user && user.isdeleted === false) {
			await this.db.deleteUserById(id);
			await this.db.deleteUserById(id);
			return true;
		}
		return false;
	}

	public async createUser(newUser: IUser): Promise<boolean> {
		const storedUser: IUser = await this.getUserById(newUser.id);
		if (!storedUser) {
			await this.db.createUser(newUser);
			return true;
		} else {
			return false;
		}
	}

	public async updateUser(newUser: IUser): Promise<void> {
		this.db.updateUser(newUser);
	}
}
