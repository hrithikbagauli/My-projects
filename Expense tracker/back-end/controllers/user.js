const user = require('../models/user');

exports.postUserSignup = (req, res, next) => {
  user.create({ name: req.body.name, email: req.body.email, password: req.body.password })
    .then(() => {
      res.status(200).json({success: true});
    })
    .catch(err => {
      res.status(400).json({success: false});
    });
}

exports.postUserLogin = (req, res, next) => {
  user.findAll({ where: { email: req.body.email } })
    .then(user => {
      if (user.length > 0) {
        if (user[0].dataValues.password == req.body.password) {
          res.status(200).json({ success: true, message: 'Authenticated successfully!' });
        }
        else {
          res.status(400).json({ success: false, message: 'Incorrect password!' });
        }
      }
      else {
        res.status(404).json({ success: false, message: "This user doesn't exist!" });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, message: "Something went wrong!" });
    })
}