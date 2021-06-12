import { ObjectId, Types, model, Schema, Model, Document } from 'mongoose';

export interface ICategory extends Document {
	name: String;
	children?: Array<ObjectId>;
	vendor: Types.ObjectId;
}

export const CategorySchema: Schema = new Schema({
	name: { type: String, required: true },
	children: [{ type: Types.ObjectId, required: true }],
	vendor: { type: Types.ObjectId, required: true }
});

const CategoryModel: Model<ICategory> = model('Category', CategorySchema);

export default CategoryModel;
