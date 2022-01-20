const express = require('express');
import { Request, Response } from 'express';
const connectDB = require('./db/connect');
require('dotenv').config();
const productsRouter = require('./routes/products.routes');
const path = require('path');
//Security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const app = express();
console.log('object');
// extra security packages
app.set('trust  proxy', 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 100,
	})
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//Swagger API
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swagger_path = path.resolve(__dirname, './swagger.yaml');
const swaggerDocument = YAML.load(swagger_path);

app.get('/', (req: Request, res: Response) => {
	res.send('<h1>Sample API</h1><a href="/api-docs">Documentation</a>');
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/v1/products', productsRouter);

const port = process.env.PORT || 8080;

async function start() {
	try {
		await connectDB(process.env.URL);
		app.listen(port, () => console.log('DB connected and app running'));
	} catch (error) {
		console.log(error);
	}
}
start();
// const { MongoClient } = require('mongodb');

// const uri =
// 	'mongodb+srv://huzaifah:infinix510@cluster0.c9gt3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
// const client = new MongoClient(uri, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// });
// app.listen(port, async () => {
// 	console.log('running');
// 	client.connect((err: any) => {
// 		console.log('Error', err);
// 		const collection = client.db('test').collection('devices');
// 		// perform actions on the collection object
// 		client.close();
// 	});
// });
