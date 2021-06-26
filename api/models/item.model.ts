import { Types, model, Schema, Model, Document, ObjectId } from 'mongoose';

export interface IItem extends Document {
	name: string;
	unitName: string;
	category: ObjectId;
	vendor: ObjectId;
}

export const ItemSchema: Schema = new Schema({
	name: { type: String, required: true },
	unitName: { type: String, required: true, default: 'units' },
	category: { type: Types.ObjectId, ref: 'Category', default: null },
	vendor: { type: Types.ObjectId, ref: 'Vendor', required: true }
});

const ItemModel: Model<IItem> = model('Item', ItemSchema);
export default ItemModel;
