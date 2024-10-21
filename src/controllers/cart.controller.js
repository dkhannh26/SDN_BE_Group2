const Cart = require('../models/cart');
const Tshirt = require('../models/tshirts');
const TshirtPantDetail = require('../models/pant_shirt_size_detail')
const TshirtPantSize = require('../models/pant_shirt_sizes')
const Image = require('../models/images');
const Account = require('../models/accounts');
class CartController {
    getList(req, res, next) {
        Cart.find({})
            .select('pant_shirt_detail_id quantity')
            .populate('pant_shirt_detail_id', 'size_id tshirt_id')
            .then((carts) => {
                const imagesPromises = carts.map((cart) => {
                    return Image.findOne({
                        tshirt_id: cart.pant_shirt_detail_id.tshirt_id
                    });
                });
                const sizePromises = carts.map((cart) => {
                    return TshirtPantSize.findOne({
                        _id: cart.pant_shirt_detail_id.size_id
                    });
                });
                const tshirtPromises = carts.map((cart) => {
                    return Tshirt.findOne({
                        _id: cart.pant_shirt_detail_id.tshirt_id
                    });
                });
                Promise.all([Promise.all(imagesPromises), Promise.all(sizePromises), Promise.all(tshirtPromises)])
                    .then(([images, sizes, tshirts]) => {
                        const combinedData = carts.map((cart, index) => {
                            const cartData = cart.toObject();
                            delete cartData.pant_shirt_detail_id;
                            // delete cartData._id;
                            return {
                                ...cartData,
                                image: images[index] ? {
                                    _id: images[index]._id,
                                    file_extension: images[index].file_extension
                                } : null,
                                size: sizes[index] ? { size_name: sizes[index].size_name } : null,
                                tshirt: tshirts[index] ? { name: tshirts[index].name, quantity: tshirts[index].quantity, price: tshirts[index].price } : null
                            };
                        });

                        res.status(200).json(combinedData);
                    })
                    .catch((error) => {
                        res.status(500).json({ error: error.message });
                    });
                // res.status(200).json({ carts });
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    createCart(req, res, next) {
        Cart.create(req.body)
            .then((cart) => {
                res.status(201).json(cart);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    deleteAllCart(req, res, next) {
        Cart.deleteMany({})
            .then((carts) => {
                res.status(200).json(carts);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    getCartById(req, res, next) {
        Cart.findById(req.params.cartId)
            .then((cart) => {
                if (!cart) return res.status(404).json({ message: 'cart not found' });
                res.status(200).json(cart);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    updateCartById(req, res, next) {
        const { quantity } = req.body;

        Cart.findByIdAndUpdate(req.params.cartId, { $set: { quantity } }, { new: true })
            .populate('pant_shirt_detail_id', 'size_id tshirt_id')
            .then((cart) => {
                if (!cart) return res.status(404).json({ message: 'Cart not found' });

                const imagePromise = Image.findOne({
                    tshirt_id: cart.pant_shirt_detail_id.tshirt_id
                });
                const sizePromise = TshirtPantSize.findOne({
                    _id: cart.pant_shirt_detail_id.size_id
                });
                const tshirtPromise = Tshirt.findOne({
                    _id: cart.pant_shirt_detail_id.tshirt_id
                });

                Promise.all([imagePromise, sizePromise, tshirtPromise])
                    .then(([image, size, tshirt]) => {
                        if (!tshirt) return res.status(404).json({ message: 'T-shirt not found' });

                        const cartData = cart.toObject();
                        delete cartData.pant_shirt_detail_id;

                        const updatedCart = {
                            ...cartData,
                            image: image ? { _id: image._id, file_extension: image.file_extension } : null,
                            size: size ? { size_name: size.size_name } : null,
                            tshirt: tshirt ? { name: tshirt.name, price: tshirt.price } : null
                        };

                        res.status(200).json(updatedCart);
                    })
                    .catch((error) => {
                        res.status(500).json({ error: error.message });
                    });
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }

    deleteCartById(req, res, next) {
        Cart.findByIdAndDelete(req.params.cartId)
            .then((cart) => {
                if (!cart) return res.status(404).json({ message: 'cart not found' });
                res.status(200).json(cart);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    getCartByAccountId(req, res, next) {
        const { accountId } = req.params;
        Account.findById(accountId)
            .populate({
                path: 'cart_id',
                populate: [
                    { path: 'pant_shirt_detail_id', populate: [{ path: 'size_id' }, { path: 'tshirt_id' }] }
                ]
            })
            .then((account) => {
                if (!account) return res.status(404).json({ message: 'Account not found' });

                const carts = account.cart_id;

                if (carts.length === 0) return res.status(200).json([]);

                const imagesPromises = carts.map((cart) => {
                    return Image.findOne({
                        tshirt_id: cart.pant_shirt_detail_id.tshirt_id
                    });
                });

                Promise.all(imagesPromises)
                    .then((images) => {
                        const combinedData = carts.map((cart, index) => {
                            const cartData = cart.toObject();
                            delete cartData.pant_shirt_detail_id;

                            return {
                                ...cartData,
                                image: images[index] ? {
                                    _id: images[index]._id,
                                    file_extension: images[index].file_extension
                                } : null,
                                size: cart.pant_shirt_detail_id.size_id ? { size_name: cart.pant_shirt_detail_id.size_id.size_name } : null,
                                tshirt: cart.pant_shirt_detail_id.tshirt_id ? {
                                    name: cart.pant_shirt_detail_id.tshirt_id.name,
                                    quantity: cart.pant_shirt_detail_id.tshirt_id.quantity,
                                    price: cart.pant_shirt_detail_id.tshirt_id.price
                                } : null
                            };
                        });

                        res.status(200).json(combinedData);
                    })
                    .catch((error) => {
                        res.status(500).json({ error: error.message });
                    });
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }


}



module.exports = new CartController;