const User = require('../models/user');

exports.postform = (req, res, next)=>{
    const expenseamount = req.body.expenseamount;
    const description = req.body.description;
    const category = req.body.category;

    User.create({
        expenseamount: expenseamount,
        description: description,
        category: category
    })
    .then(result=> res.json(result))
    .catch(err=>{
        console.log(err);
    })
}

exports.getdata = (req, res, next)=>{
    User
    .findAll()
    .then(users => {
        res.json(users);
    })
    .catch(err=>console.log(err));
}

exports.postDeleteItem = (req, res, next)=>{
    User.findByPk(req.body.id)
    .then(user=> user.destroy())
    .catch(err=>console.log(err));
}