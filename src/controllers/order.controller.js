const Orders = require('../models/orders');
const OrderDetails = require('../models/order_details');

class OrderController {
    getList(req, res, next) {
        Orders.find({})
            .populate('account_id', 'username')
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
                res.status(201).json(order);
            })
            .catch((err) => {
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
        Orders.find({ accountId: req.params.accountId })
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
        Orders.find({ accountId: req.params.accountId, status: { $in: ['delivered', 'processing', 'pending'] } })
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
                        .then((updateOrder) => {
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
        OrderDetails.find({ order: req.params.orderId })
            .populate('order_id', 'total_price', 'phone', 'address', 'status')
            .populate('pant_shirt_size_detail_id', 'shirt_id', 'pant_id', 'size_id')
            .populate('shoes_size_detail_id', 'shoes_id', 'size_id')
            .populate('accessory_id', 'name', 'quantity', 'price')
            .then((details) => {
                if (!details) return res.status(404).json({ message: 'order details not found' });
                res.status(200).json(details);
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }
}

module.exports = new OrderController;