const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postUserSignup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    User.create({ name: req.body.name, email: req.body.email, password: hash })
      .then(() => {
        res.status(201).json({ success: true });
      })
      .catch(err => {
        res.status(400).json({ success: false });
      });
  })
}

exports.postUserLogin = (req, res, next) => {
  User.findAll({ where: { email: req.body.email } })
    .then(user => {
      if (user.length > 0) {
        bcrypt.compare(req.body.password, user[0].dataValues.password, (err, result) => {
          if (result) {
            res.json({success: true, message: 'Authenticated successfully!', username: user[0].name, token: generateToken(user[0].id, user[0].name)});
          }
          else {
            res.status(401).json({ success: false, message: 'Incorrect password!' });
          }
        })
      }
      else {
        res.status(404).json({ success: false, message: "This user doesn't exist!" });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, message: "Something went wrong!" });
    })
}

function generateToken(id, user){
  return jwt.sign({userId: id, name: user}, 'secretKey');
}