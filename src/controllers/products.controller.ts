import { Request, Response } from 'express';
import { UserInput } from '../utils';
const { StatusCodes } = require('http-status-codes');
const { ProductModel } = require('../models/Product.model');

type QueryType = {
	available?: Boolean;
	manufacturer?: string;
	name?: any;
	sortColumn?: string;
	sortDir?: string;
};

interface Product extends UserInput {
	createdAt: Date;
	updatedAt: Date;
}

const get_all_products = async (req: Request, res: Response) => {
	const { available, manufacturer, search, sortColumn, sortDir } = req.query;

	const queryObj: QueryType = {};
	if (available) {
		queryObj.available = available === 'true' ? true : false;
	}
	if (manufacturer) {
		queryObj.manufacturer = manufacturer as string;
	}

	if (search) {
		queryObj.name = { $regex: search, $options: 'i' } as any;
	}
	console.log(queryObj);

	// const products: Array<Product> = await ProductModel.find(queryObj).sort();
	let result = ProductModel.find(queryObj);
	if (sortColumn) {
		const sortList = (<string>sortColumn).split(',').join(' ');
		result = result.sort(sortList);
	} else {
		result = result.sort('createdAt');
	}

	// Pagination

	const page: number = Number(req.query.page) || 1;
	const limit: number = Number(req.query.pageSize) || 2;
	const skip: number = (page - 1) * limit;
	result = result.skip(skip).limit(limit);
	const total = await ProductModel.countDocuments({});
	const products: Array<Product> = await result;
	res.status(StatusCodes.OK).json({ total, nHits: products.length, products });
};

const create_product = async (req: Request, res: Response) => {
	const product: UserInput = {
		name: req.body.name,
		price: req.body.price,
		rating: req.body.rating,
		available: req.body.available,
		manufacturer: req.body.manufacturer,
	};

	const _product = await ProductModel.create({ ...product });
	res.status(StatusCodes.CREATED).json({ message: _product });
};

const get_product = async (req: Request, res: Response) => {
	const params = req.params.id;
	const product = await ProductModel.findOne({ _id: params });
	res.status(StatusCodes.OK).json({ product });
};

module.exports = {
	get_all_products,
	create_product,
	get_product,
};

// Documentation
// For simple queries
// url: http://localhost:8080/api/v1/products?available=true&manufacturer=companyA
// const products = await ProductModel.find(req.query).sort('createdAt');

// For multiple query parameters
// Create and object and mutate the object with the specified data
// 	const queryObj: QueryType = {};
// 	if (available) {
// 		queryObj.available = available === 'true' ? true : false;
// 	}
// 	if (manufacturer) {
// 		queryObj.manufacturer = manufacturer as string;
// 	}
// After here, pas s the queryObj to the find method

// For sorting
// Only useful for a field a time
// let sort: string = '';
// if (sortColumn) {
// 	let direction = sortDir ? (sortDir === 'asc' ? '' : '-') : '';
// 	sort = `${direction}${sortColumn}`;
// }
