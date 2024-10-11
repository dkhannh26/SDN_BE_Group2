var express = require("express");
const cartController = require('../controllers/cart.controller');
var cartRouter = express.Router();


cartRouter.get('/', cartController.getList);
cartRouter.post('/', cartController.createcart);
cartRouter.delete('/', cartController.deleteAllCart);
cartRouter.get('/:cartId', cartController.getcartById);
cartRouter.put('/:cartId', cartController.updatecartById);
cartRouter.delete('/:cartId', cartController.deletecartById);

module.exports = cartRouter;