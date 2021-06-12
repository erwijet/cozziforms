import { model, Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
	isAdmin: boolean;
	firstName: string;
	lastName: string;
	username: string;
	hash: string;
}

export const UserSchema: Schema = new Schema({
	isAdmin: { type: Boolean, required: true, default: false },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	hash: { type: String, required: true }
});

const UserModel: Model<IUser> = model('User', UserSchema);

export default UserModel;
