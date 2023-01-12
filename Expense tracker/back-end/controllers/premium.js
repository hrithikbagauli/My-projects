const dotenv = require('dotenv');
dotenv.config();
const Razorpay = require('Razorpay');
const User = require('../models/user');
const Expense = require('../models/expense');
const Download = require('../models/download');
const sequelize = require('../util/database');
const UserServices = require('../services/user-services');
const S3services = require('../services/S3services');

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
    let page = 1;
    if (req.query.page) {
        page = parseInt(req.query.page);
    }
    const reportType = req.query.reportType;
    let date = new Date();
    const items_per_page = 5;
    let result;
    if (req.user.premiumUser) {
        try {
            const totalItems = (await req.user.getExpenses()).length;
            if (reportType == 'Daily') {
                let year = date.getFullYear();
                let month = date.getMonth() + 1;  // getMonth() returns a zero-based month, so we need to add 1
                let day = date.getDate();
                let formattedDate = `${year}-${month}-${day}`;
                result = await req.user.getExpenses({
                    where: sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', formattedDate)
                })
            }
            else if (reportType == 'Monthly') {
                result = await req.user.getExpenses({
                    where: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), '=', date.getMonth() + 1)
                })
            }
            else {
                result = await req.user.getExpenses({
                    offset: (page - 1) * items_per_page, limit: items_per_page,
                    where: sequelize.where(sequelize.fn('year', sequelize.col('createdAt')), '=', date.getFullYear())
                })
            }
            res.json({
                result,
                currentPage: page,
                hasNextPage: page * items_per_page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / items_per_page)
            });
        } catch (err) {
            console.log(err)
        }
    }
    else {
        res.status(401).json([]);
    }
}

exports.getDownload = async (req, res, next) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `expenses${userId} | ${new Date()}.txt`;
        const fileUrl = await S3services.uploadToS3(stringifiedExpenses, filename);
        await req.user.createDownload({ name: filename, url: fileUrl });
        res.status(200).json({ fileUrl, success: true });
    } catch (err) {
        res.status(500).json({ fileUrl: '', success: false });
    }
}

// function uploadToS3(data, filename) {
//     const BUCKET_NAME = process.env.BUCKET_NAME;
//     const IAM_USER_KEY = process.env.IAM_USER_KEY;
//     const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

//     let s3bucket = new AWS.S3({
//         accessKeyId: IAM_USER_KEY,
//         secretAccessKey: IAM_USER_SECRET,
//     })
//     let params = {
//         Bucket: BUCKET_NAME,
//         Key: filename,
//         Body: data,
//         ACL: 'public-read'
//     }
//     return new Promise((resolve, reject) => {
//         s3bucket.upload(params, (err, s3response) => {
//             if (err) {
//                 console.log('something went wrong!');
//                 reject(err);
//             }
//             else {
//                 console.log('success', s3response);
//                 resolve(s3response.Location);
//             }
//         })
//     })
// }
