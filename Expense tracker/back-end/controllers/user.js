const user = require('../models/user');

exports.postUserSignup = (req, res, next)=>{
  user.create({name: req.body.name, email: req.body.email, password: req.body.password})
  .then(()=>{
    res.json('success')
  })
  .catch(err=>res.json('fail'));
}