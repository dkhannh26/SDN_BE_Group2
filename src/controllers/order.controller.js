const Orders = require('../models/orders');

class OrderController {
    getList(req, res, next) {
        Orders.find({})
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
}

module.exports = new OrderController;