var express = require("express");
const orderController = require('../controllers/order.controller');
var orderRouter = express.Router();


orderRouter.get('/', orderController.getList);
orderRouter.post('/', orderController.createOrder);
orderRouter.delete('/', orderController.deleteOrderById);
orderRouter.get('/:orderId', orderController.getOrderById);
orderRouter.put('/:orderId', orderController.updateOrderById);
orderRouter.delete('/:orderId', orderController.deleteOrderById);

module.exports = orderRouter;