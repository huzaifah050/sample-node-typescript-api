const mongoose = require('mongoose');

const connectDB = (url: string) => {
	return mongoose.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
};

module.exports = connectDB;
// async function connectDB(url: string) {
// 	try {
// 		await mongoose.connect(url);
// 		console.log('DB connected');
// 	} catch (error) {
// 		console.log('Error connecting connecting', error);
// 		process.exit(1);
// 	}
// }

// module.exports = { connectDB };
