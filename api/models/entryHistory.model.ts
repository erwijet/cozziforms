import {
	Types,
	model,
	Schema,
	Model,
	Document,
	ObjectId,
	Date
} from 'mongoose';

export enum EntryActionEnum {
	Created = 0,
	Removed = 1,
	Ordered = 2,
	Modified = 3
}

export interface IEntryHistory extends Document {
	entryId: ObjectId;
	timestamp: Date;
	action: EntryActionEnum;
	user: ObjectId;
	stale: boolean;
}

export const EntryHistorySchema: Schema = new Schema({
	entryId: { type: Types.ObjectId, ref: 'Entry', required: true },
	timestamp: { type: Date, required: true },
	action: { type: Number, enum: [0, 1, 2, 3], required: true },
	user: { type: Types.ObjectId, ref: 'User', required: true },
	stale: { type: Boolean, required: true, default: false }
});

const EntryHistory: Model<IEntryHistory> = model(
	'EntryHistory',
	EntryHistorySchema
);
export default EntryHistory;
