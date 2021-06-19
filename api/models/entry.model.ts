import {
	Types,
	model,
	Schema,
	Model,
	Document,
	ObjectId,
	Date
} from 'mongoose';

export enum ListName {
	Order = 0,
	Waste = 1
}

export interface IEntry extends Document {
	itemId: ObjectId;
	enteredBy: ObjectId;
	enteredOn: Date;
	isOrdered: boolean;
	orderedBy: ObjectId;
	originalQuantity: number;
	currentQuantity: number;
	history: Array<ObjectId>;
	boundedListName: ListName;
	stale: boolean;
}

export const EntrySchema: Schema = new Schema({
	itemId: { type: Types.ObjectId, ref: 'Item', required: true },
	enteredBy: { type: Types.ObjectId, ref: 'User', required: true },
	enteredOn: { type: Date, required: true },
	isOrdered: { type: Boolean, required: true, default: false },
	orderedBy: { type: Types.ObjectId, ref: 'User' },
	originalQuantity: { type: Number, required: true },
	currentQuantity: { type: Number, required: true },
	history: [{ type: Types.ObjectId, ref: 'EntryHistory' }],
	boundedListName: { type: Number, enum: [0, 1], required: true },
	stale: { type: Boolean, required: true, default: false }
});

const EntryModel: Model<IEntry> = model('Entry', EntrySchema);
export default EntryModel;
