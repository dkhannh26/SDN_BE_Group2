var express = require("express");
const orderController = require('../controllers/order.controller');
var orderRouter = express.Router();


orderRouter.get('/', orderController.getList);
orderRouter.post('/', orderController.createOrder);
orderRouter.delete('/', orderController.deleteAllOrder);
orderRouter.get('/:orderId', orderController.getOrderById);
orderRouter.put('/:orderId', orderController.updateOrderById);
orderRouter.delete('/:orderId', orderController.deleteOrderById);
orderRouter.get('/details/:orderId', orderController.getOrderDetails);
orderRouter.put('/confirm/:orderId', orderController.confirmOrder);
orderRouter.put('/cancel/:orderId', orderController.cancelOrder);
orderRouter.get('/account/:accountId', orderController.getOrderByAccountId);
orderRouter.get('/history/:accountId', orderController.getOrderHistoryByAccountId);
orderRouter.get('/list/:accountId', orderController.getOrderListByAccountId);

module.exports = orderRouter;