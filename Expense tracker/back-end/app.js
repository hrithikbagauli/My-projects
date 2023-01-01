const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(userRoutes);
app.use(expenseRoutes);

sequelize
.sync()
.then(()=>{
  app.listen(4000);
}
)
.catch(err => {
  console.log(err);
});

//   .sync({ force: true })
// //   .sync()
//   .then(result => {
//     return User.findByPk(1);
//   })
//   .then(user => {
//     if (!user) {
//       return User.create({ name: 'Ross', email: 'ross@gmail.com' });
//     }
//     return user;
//   })
//   .then(user => {
//     return user.createCart();
//   })
//   .then(cart=>{
//     app.listen(4000);
//   })
//   .catch(err => {
//     console.log(err);
//   });
