import { Types, model, Schema, Model, Document, ObjectId } from 'mongoose';

export interface IItem extends Document {
	name: string;
	unitName: string;
	defaultQuantity: number;
	vendor: ObjectId;
}

export const ItemSchema: Schema = new Schema({
	name: { type: String, required: true },
	unitName: { type: String, required: true, default: 'units' },
	defaultQuantity: { type: Number, required: true, default: 1 },
	vendor: { type: Types.ObjectId, required: true }
});

const ItemModel: Model<IItem> = model('Item', ItemSchema);
export default ItemModel;
