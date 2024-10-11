const express = require('express');
const discountController = require('../controllers/discount.controller');
const discountRoute = express.Router()

routes.get('/:id', discountController.getById)
routes.get('/', discountController.getList)
routes.post('/', discountController.create)
routes.put('/:id', discountController.update)
routes.delete('/:id', discountController.delete)

module.exports = discountRoute;