import * as jwt from 'jsonwebtoken';
import { IUser } from '../models/users.model';

const config = require('./config.json');
export const authenticationPath = '/authenticate';

const login = (username: string, password: string, dbUser: IUser): string | null  => {
	if (dbUser && dbUser.password !== password) {
		return null;
	} else {
		return jwt.sign({ sub: username }, config.secret);
	}
};

export const buildAuthentication = usersService => {
	return async (req, res) => {
		const { id, password }: IUser = req.body;
		const dbUser: IUser = await usersService.getUserById(id);
		const token = login(id, password, dbUser);
		if (!token) {
			res.status(403).send({ success: false, message: 'Wrong name or password' });
		} else {
			res.send(token);
		}
	};
};

export const checkToken = (req, res, next) => {
	if (req.path === authenticationPath) {
		return next();
	}
	const token: string = req.headers[config.headerName];
	if (token) {
		jwt.verify(token, config.secret, (err, decode) => {
			if (err) {
				res.status(403).send({ success: false, message: 'Forbidden Error' });
			} else {
				next();
			}
		});
	} else {
		res.status(401).send({ success: false, message: 'Unauthorized Error' });
	}
};
