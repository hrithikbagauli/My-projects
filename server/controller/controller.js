const User = require('../models/user');

exports.postform = async (req, res, next) => {
    const expenseamount = req.body.expenseamount;
    const description = req.body.description;
    const category = req.body.category;

    const result = await User.create({
        expenseamount: expenseamount,
        description: description,
        category: category
    })
    
    res.json(result);
}

exports.getdata = async (req, res, next) => {
    const users = await User.findAll();
    res.json(users);
}

exports.postDeleteItem = async (req, res, next) => {
    const user = await User.findByPk(req.body.id)
    res.json(user);
    user.destroy();
}
