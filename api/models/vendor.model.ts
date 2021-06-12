import { model, Schema, Model, Document } from 'mongoose';

export interface IVendor extends Document {
	name: string;
}

export const VendorSchema: Schema = new Schema({
	name: { type: String, required: true }
});

const VendorModel: Model<IVendor> = model('Vendor', VendorSchema);
export default VendorModel;
