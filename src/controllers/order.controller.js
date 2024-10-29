const Orders = require('../models/orders');
const OrderDetails = require('../models/order_details');
const pantShirtSizeDetail = require('../models/pant_shirt_size_detail');
const shoesSizeDetail = require('../models/shoes_size_detail');
const Accounts = require('../models/accounts');
const Tshirt = require('../models/tshirts');
const Pant = require('../models/pants');
const Shoes = require('../models/shoes');
const Accessory = require('../models/accessories')

class OrderController {
    getList(req, res, next) {
        Orders.find({})
            // .populate('account_id')
            .then((orders) => {
                res.status(200).json(orders);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    createOrder(req, res, next) {
        Orders.create(req.body)
            .then(async (order) => {
                const { orderItems } = req.body;
                const orderDetailsData = orderItems.map(item => ({
                    order_id: order._id,
                    accessory_id: item.accessory_id,
                    shoes_size_detail_id: item.shoes_size_detail_id,
                    pant_shirt_size_detail_id: item.pant_shirt_size_detail_id,
                    quantity: Number(item.quantity)
                }));
                const orderDetails = await OrderDetails.create(orderDetailsData);
                res.status(201).json({
                    orderDetails,
                });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: err.message });
            });
    }


    deleteAllOrder(req, res, next) {
        Orders.deleteMany({})
            .then((Orders) => {
                res.status(200).json(Orders);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    getOrderById(req, res, next) {
        Orders.findById(req.params.orderId)
            .populate('account_id', 'username')
            .then((order) => {
                if (!order) return res.status(404).json({ message: 'order not found' });
                res.status(200).json(order);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    updateOrderById(req, res, next) {
        Orders.findByIdAndUpdate(req.params.orderId, req.body, { new: true })
            .then((order) => {
                if (!order) return res.status(404).json({ message: 'order not found' });
                res.status(200).json(order);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    deleteOrderById(req, res, next) {
        Orders.findByIdAndDelete(req.params.orderId)
            .then((order) => {
                if (!order) return res.status(404).json({ message: 'order not found' });
                res.status(200).json(order);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    getOrderByAccountId(req, res, next) {
        Orders.find({ account_id: req.params.accountId })
            .populate('account_id', 'username')
            .then((orders) => {
                if (!orders) return res.status(404).json({ message: 'orders not found' });
                res.status(200).json(orders);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    getOrderHistoryByAccountId(req, res, next) {
        Orders.find({ accountId: req.params.accountId, status: { $in: ['shipped', 'cancelled'] } })
            .then((orders) => {
                if (!orders) return res.status(404).json({ message: 'orders not found' });
                res.status(200).json(orders);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    getOrderListByAccountId(req, res, next) {
        Orders.find({ account_id: req.params.accountId, status: { $in: ['delivered', 'processing', 'pending'] } })
            .then((orders) => {
                if (!orders) return res.status(404).json({ message: 'orders not found' });
                res.status(200).json(orders);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    confirmOrder(req, res, next) {
        Orders.findByIdAndUpdate(req.params.orderId, { status: 'processing' }, { new: true })
            .populate('account_id', 'username')
            .then((order) => {
                if (!order) return res.status(404).json({ message: 'order not found' });
                res.status(200).json(order);
                let updateData = req.body.updateData;
                const updatePantShirtQuantity = updateData.pant_shirt_size_detail_id.map((id, index) => {
                    if (id) {
                        return pantShirtSizeDetail.findById(id)
                            .then((pantShirtDetail) => {
                                if (pantShirtDetail) {
                                    const newQuantity = pantShirtDetail.quantity - updateData.quantities[index];
                                    return pantShirtSizeDetail.findByIdAndUpdate(
                                        id,
                                        { quantity: newQuantity },
                                        { new: true }
                                    );
                                } else {
                                    throw new Error(`PantShirtSizeDetail with ID ${id} not found`);
                                }
                            });
                    } else {
                        return Promise.resolve();
                    }
                });
                const updateShoesQuantity = updateData.shoes_size_detail_id.map((id, index) => {
                    if (id) {
                        return shoesSizeDetail.findById(id)
                            .then((shoesDetail) => {
                                if (shoesDetail) {
                                    const newQuantity = shoesDetail.quantity - updateData.quantities[index];
                                    return shoesSizeDetail.findByIdAndUpdate(
                                        id,
                                        { quantity: newQuantity },
                                        { new: true }
                                    );
                                }
                            })
                    } else {
                        return Promise.resolve();
                    }
                });
                const updateAccessoryQuantity = updateData.accessory_id.map((id, index) => {
                    if (id) {
                        return Accessory.findById(id)
                            .then((accessory) => {
                                if (accessory) {
                                    const newQuantity = accessory.quantity - updateData.quantities[index];
                                    return Accessory.findByIdAndUpdate(
                                        id,
                                        { quantity: newQuantity },
                                        { new: true }
                                    );
                                }
                            })
                    } else {
                        Promise.resolve();
                    }
                });
                Promise.all([updatePantShirtQuantity, updateShoesQuantity, updateAccessoryQuantity])
                    .then(() => {
                        setTimeout(() => {
                            Orders.findByIdAndUpdate(req.params.orderId, { status: 'delivered' }, { new: true })
                                .then(() => {
                                    console.log('order has been delivered');
                                })
                                .catch((err) => {
                                    console.log('Error updating order status to delivered', err);
                                });
                        }, 60000)
                    })
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    cancelOrder(req, res, next) {
        Orders.findByIdAndUpdate(req.params.orderId, { status: 'cancelled' }, { new: true })
            .populate('account_id', 'username')
            .then((order) => {
                if (!order) return res.status(404).json({ message: 'order not found' });
                res.status(200).json(order);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
    getOrderDetails(req, res, next) {
        OrderDetails.find({ order_id: req.params.orderId })
            .populate('pant_shirt_size_detail_id')
            .populate('shoes_size_detail_id')
            .populate('accessory_id')
            .then((details) => {
                if (!details.length) return res.status(404).json({ message: 'Order details not found' });

                const shirtPromises = details.map((product) =>
                    Tshirt.findOne({ _id: product.pant_shirt_size_detail_id?.tshirt_id })
                );
                const pantPromises = details.map((product) =>
                    Pant.findOne({ _id: product.pant_shirt_size_detail_id?.pant_id })
                );
                const shoesPromises = details.map((shoes) =>
                    Shoes.findOne({ _id: shoes.shoes_size_detail_id?.shoes_id })
                );
                const accessoriesPromises = details.map((accessories) =>
                    Accessory.findOne({ _id: accessories.accessory_id })
                );

                Promise.all([
                    Promise.all(shirtPromises),
                    Promise.all(pantPromises),
                    Promise.all(shoesPromises),
                    Promise.all(accessoriesPromises)
                ])
                    .then(([shirts, pants, shoes, accessories]) => {
                        const combinedData = details.map((detail, index) => {
                            const detailData = detail.toObject();

                            const productData = shirts[index] || pants[index] || shoes[index] || accessories[index];

                            return {
                                ...detailData,
                                product: productData ? {
                                    id: productData._id,
                                    name: productData.name,
                                    price: productData.price,
                                } : null,
                            };
                        });

                        res.status(200).json(combinedData);
                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.message });
                    });
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }

}

module.exports = new OrderController;