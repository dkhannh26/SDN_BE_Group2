const Carts = require('../models/cart');

class CartController {
    getList(req, res, next) {
        Carts.find({})
            .then((Carts) => {
                res.status(200).json(Carts);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    createCart(req, res, next) {
        Carts.create(req.body)
            .then((cart) => {
                res.status(201).json(cart);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    deleteAllCart(req, res, next) {
        Carts.deleteMany({})
            .then((carts) => {
                res.status(200).json(carts);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    getCartById(req, res, next) {
        Carts.findById(req.params.cartId)
            .then((cart) => {
                if (!cart) return res.status(404).json({ message: 'cart not found' });
                res.status(200).json(cart);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    updateCartById(req, res, next) {
        Carts.findByIdAndUpdate(req.params.cartId, req.body, { new: true })
            .then((cart) => {
                if (!cart) return res.status(404).json({ message: 'cart not found' });
                res.status(200).json(cart);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    deleteCartById(req, res, next) {
        Carts.findByIdAndDelete(req.params.cartId)
            .then((cart) => {
                if (!cart) return res.status(404).json({ message: 'cart not found' });
                res.status(200).json(cart);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
}

module.exports = new CartController;