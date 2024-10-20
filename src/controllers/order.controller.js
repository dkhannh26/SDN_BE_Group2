const Orders = require('../models/orders');
const OrderDetails = require('../models/order_details');
const pantShirtSizeDetail = require('../models/pant_shirt_size_detail');
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
            .then((order) => {
                const orderDetailsData = {
                    ...req.body,
                    order_id: order._id
                };
                return OrderDetails.create(orderDetailsData);
            })
            .then((orderDetails) => {
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
            .then((details) => {
                if (!details) return res.status(404).json({ message: 'order details not found' });
                // res.status(200).json(details);
                const pantShirtSizeDetailPromises = details.map((pantShirt) => {
                    return pantShirtSizeDetail.findOne({
                        _id: pantShirt.pant_shirt_size_detail_id,
                    });
                });
                const shoesSizeDetailPromises = details.map((shoes) => {
                    return Shoes.findOne({
                        _id: shoes.shoes_size_detail_id,
                    })
                })
                const accessoriesDetailPromises = details.map((accessories) => {
                    return Accessory.findOne({
                        _id: accessories.accessory_id,
                    })
                })
                Promise.all([Promise.all(pantShirtSizeDetailPromises), Promise.all(shoesSizeDetailPromises), Promise.all(accessoriesDetailPromises)])
                    .then(([pantShirtDetails, shoesDetails, accessoriesDetails]) => {
                        const tshirtPromises = pantShirtDetails.map((pantShirt) => {
                            return pantShirt ? Tshirt.findOne({ _id: pantShirt.tshirt_id }) : null;
                        });
                        const pantPromises = pantShirtDetails.map((pantShirt) => {
                            return pantShirt ? Pant.findOne({ _id: pantShirt.pant_id }) : null;
                        });
                        const shoesPormises = shoesDetails.map((shoes) => {
                            return shoes ? shoes.findOne({ _id: shoes.shoes_id }) : null;
                        })
                        const accessoriesPormises = accessoriesDetails.map((accessories) => {
                            return accessories ? accessories.findOne({ _id: accessories.accessory_id }) : null;
                        });
                        Promise.all([Promise.all(tshirtPromises), Promise.all(pantPromises), Promise.all(shoesPormises), Promise.all(accessoriesPormises)])
                            .then(([tshirts, pants, shoes, accessories]) => {
                                const combinedData = details.map((detail, index) => {
                                    const detailData = detail.toObject();
                                    return {
                                        ...detailData,
                                        pantShirt: pantShirtDetails[index] ? {
                                            tshirt_id: pantShirtDetails[index].tshirt_id,
                                            tshirt_name: tshirts[index] ? tshirts[index].name : null,
                                            tshirt_price: tshirts[index] ? tshirts[index].price : null,
                                            pant_id: pantShirtDetails[index].pant_id,
                                            pant_name: pants[index] ? pants[index].name : null,
                                            pant_price: pants[index] ? pants[index].price : null,
                                        } : null,
                                        shoes: shoesDetails[index] ? {
                                            shoes_id: shoesDetails[index].shoes_id,
                                            shoes_name: shoes[index] ? shoes[index].name : null,
                                            shoes_price: shoes[index] ? shoes[index].price : null,
                                        } : null,
                                        accessories: accessoriesDetails[index] ? {
                                            accessories_id: accessoriesDetails[index].accessories_id,
                                            accessories_name: accessories[index] ? accessories[index].name : null,
                                            accessories_price: accessories[index] ? accessories[index].price : null,
                                        } : null,
                                    };
                                })
                                res.status(200).json(combinedData);
                            })

                    })
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }

}

module.exports = new OrderController;