const dotenv = require('dotenv');
dotenv.config();
const Razorpay = require('Razorpay');
const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

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
    if (req.user.premiumUser) {
        User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']],
            include: [{
                model: Expense,
                attributes: []
            }],
            group: ['user.id'],
            order: [sequelize.literal('total_cost DESC')]
        })
            .then(result => {
                res.json(result);
            })
            .catch(err => console.log(err));
    }
    else {
        res.status(401).json([]);
    }

    //the equivalent query for the above sequelize code inside user.findAll() is :- 
    // SELECT user.id, user.name, SUM(expenses.amount) AS total_cost
    // FROM user
    // INNER JOIN expenses ON expenses.user_id = user.id
    // GROUP BY user.id
    // ORDER BY total_cost DESC
}

exports.getReport = async (req, res, next) => {
    const reportType = req.query.reportType;
    let date = new Date();

    if(req.user.premiumUser){
        try{
            if (reportType == 'Daily') {
                let year = date.getFullYear();
                let month = date.getMonth() + 1;  // getMonth() returns a zero-based month, so we need to add 1
                let day = date.getDate();
                let formattedDate = `${year}-${month}-${day}`;
                const result = await req.user.getExpenses({
                    where: sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', formattedDate)
                })
                res.json(result);
            }
            else if (reportType == 'Monthly') {
                const result = await req.user.getExpenses({
                    where: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), '=', new Date().getMonth()+1)
                })
                res.json(result);
            }
            else {
                const result = await req.user.getExpenses({
                    where: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), '=', new Date().getFullYear())
                })
                res.json(result);
            }
        }catch(err){
            console.log(err)
        }
    }
    else{
        res.status(401).json([]);
    }
}
