var express = require("express");
const orderController = require('../controllers/order.controller');
var orderRouter = express.Router();


orderRouter.get('/', orderController.getList);
orderRouter.post('/', orderController.createOrder);
orderRouter.delete('/', orderController.deleteAllOrder);
orderRouter.get('/:orderId', orderController.getOrderById);
orderRouter.put('/:orderId', orderController.updateOrderById);
orderRouter.delete('/:orderId', orderController.deleteOrderById);
orderRouter.get('/orderId', orderController.getOrderDetails);
orderRouter.get('/:accountId', orderController.getOrderByAccountId);
orderRouter.get('/accountId', orderController.getOrderHistoryByAccountId);
orderRouter.get('/:accountId', orderController.getOrderListByAccountId);
orderRouter.put('/:accountId', orderController.confirmOrder);
orderRouter.put('/:accountId', orderController.cancelOrder);

module.exports = orderRouter;