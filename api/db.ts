import mongoose from 'mongoose';
import { config } from 'dotenv';
import UserModel, { IUser } from './models/user.model';

config();

const { DB_CONNECTION_STRING } = process.env;
let isConnected = false;

// verify connection to the database
export async function checkDBConnection() {
	if (isConnected) return;

	await mongoose.connect(DB_CONNECTION_STRING || '', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	});

	isConnected = true;
}

export async function createUser(spec: IUser): Promise<IUser> {
	const usr = await UserModel.create(spec);
	return await usr.save();
}
