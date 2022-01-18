import { UserInput } from './../utils/index';
import { model, Schema, Model, Document } from 'mongoose';

interface Product extends UserInput {
	createdAt: Date;
	updatedAt: Date;
}

const ProductSchema: Schema = new Schema<Product>(
	{
		name: {
			type: String,
			required: [true, 'Name must be provided'],
		},
		price: {
			type: String,
			required: [true, 'Price must be provided'],
		},
		rating: {
			type: Number,
			required: [true, 'Rating must be provided'],
		},
		available: {
			type: Boolean,
			required: [true, 'Availability is required'],
		},
		manufacturer: {
			type: String,
			enum: {
				values: ['companyA', 'companyB', 'companyC'],
				message: '{VALUE} is not supported',
			},
		},
		createdAt: {
			type: Date,
			date: Date.now(),
		},
	},
	{ timestamps: true }
);

const ProductModel: Model<Product> = model('Product', ProductSchema);

module.exports = { ProductModel };
