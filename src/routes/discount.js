const express = require('express');
const discountController = require('../controllers/discount.controller');
const discountRoute = express.Router()

discountRoute.get('/:id', discountController.getById)
discountRoute.get('/', discountController.getList)
discountRoute.post('/', discountController.create)
discountRoute.put('/:id', discountController.update)
discountRoute.delete('/:id', discountController.delete)

module.exports = discountRoute;