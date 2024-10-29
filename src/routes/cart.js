var express = require("express");
const cartController = require('../controllers/cart.controller');
var cartRouter = express.Router();


cartRouter.get('/', cartController.getList);
cartRouter.post('/', cartController.createCart);
cartRouter.get('/:cartId', cartController.getCartById);
cartRouter.put('/:cartId', cartController.updateCartById);
cartRouter.delete('/:accountId', cartController.deleteAllCartByAccountId);

module.exports = cartRouter;