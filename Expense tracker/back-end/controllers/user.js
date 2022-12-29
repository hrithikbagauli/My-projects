const user = require('../models/user');

exports.postUserSignup = (req, res, next)=>{
  console.log(req.body);
  res.json("success!");
}