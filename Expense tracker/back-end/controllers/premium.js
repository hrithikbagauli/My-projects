const dotenv = require('dotenv');
dotenv.config();
const Razorpay = require('Razorpay');
const User = require('../models/user');
const Expense = require('../models/expense');

exports.getPremium = (req, res, next) => {
    try {
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 10000;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderId: order.id, status: 'PENDING' })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch(err => {
                    throw new Error(err);
                })
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err })
    }
}

exports.updateTransactionStatus = (req, res, next) => {
    if (req.body.payment_id) {
        req.user.getOrders({ where: { orderId: req.body.orderId } })
            .then(orders => {
                const order = orders[0];
                const promise1 = order.update({ paymentId: req.body.payment_id, status: "successful" });
                const promise2 = req.user.update({ premiumUser: true });
                Promise.all([promise1, promise2])
                    .then(() => {
                        res.status(202).json({ success: true, message: "transaction successful!" });
                    })
                    .catch(err => console.log(err));
            })
    }
    else {
        req.user.getOrders({ where: { orderId: req.body.orderId } })
            .then(orders => {
                const order = orders[0];
                order.update({ status: "failed" })
                    .then(() => {
                        res.status(202).json({ success: false, message: "transaction failed!" });
                    })
                    .catch(err => console.log(err));
            })
    }
}

exports.getScoreboard = (req, res, next) => {
    Expense.findAll({
        include: [{ model: User }]
    })
        .then(result => {
            res.json(result);
        })
        .catch(err => console.log(err));
}