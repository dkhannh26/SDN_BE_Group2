var express = require("express");
const cartController = require('../controllers/cart.controller');
var cartRouter = express.Router();


cartRouter.get('/', cartController.getList);
cartRouter.post('/', cartController.createCart);
cartRouter.delete('/', cartController.deleteAllCart);
cartRouter.get('/:cartId', cartController.getCartById);
cartRouter.put('/:cartId', cartController.updateCartById);
cartRouter.delete('/:cartId', cartController.deleteCartById);

module.exports = cartRouter;