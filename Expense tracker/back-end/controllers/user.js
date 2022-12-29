const user = require('../models/user');

exports.postUserSignup = (req, res, next)=>{
  user.create({name: req.body.name, email: req.body.email, password: req.body.password})
  .then(()=>{
    res.json('success')
  })
  .catch(err=>res.json('fail'));
}

exports.postUserLogin = (req, res, next)=>{
  user.findAll({where:{email: req.body.email}})
  .then(result=>{
    if(result[0].dataValues.password == req.body.password){
      res.json('password success');
    }
    else{
      res.json('password fail');
    }
  })
  .catch(err=>{
    res.json('email fail');
  })
}