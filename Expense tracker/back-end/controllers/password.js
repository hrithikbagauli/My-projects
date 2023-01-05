const sequelize = require('../util/database');

exports.forgotPassword = (req, res, next)=>{
    const email = req.body.email;
    res.json('success');
}