const User = require('../models/user');

exports.postform = (req, res, next)=>{
    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone;

    User.create({
        username: username,
        phone: phone,
        email: email
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