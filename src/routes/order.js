var express = require("express");
const orderController = require('../controllers/order.controller');
var orderRouter = express.Router();


orderRouter.get('/', orderController.getList);
orderRouter.post('/', orderController.createOrder);
orderRouter.delete('/', orderController.deleteAllOrder);
orderRouter.get('/pending', orderController.getListPending);
orderRouter.get('/done', orderController.getListDone);
orderRouter.get('/:orderId', orderController.getOrderById);
orderRouter.put('/:orderId', orderController.updateOrderById);
orderRouter.delete('/:orderId', orderController.deleteOrderById);
orderRouter.get('/details/:orderId', orderController.getOrderDetails);
orderRouter.put('/confirm/:orderId', orderController.confirmOrder);
orderRouter.put('/cancel/:orderId', orderController.cancelOrder);
orderRouter.get('/account/:accountId', orderController.getOrderByAccountId);

module.exports = orderRouter;