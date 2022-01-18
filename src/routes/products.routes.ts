const express = require('express');
const router = express.Router();
const {
	get_all_products,
	create_product,
	get_product,
} = require('../controllers/products.controller');

router.route('/').get(get_all_products).post(create_product);
router.route('/:id').get(get_product);

module.exports = router;
