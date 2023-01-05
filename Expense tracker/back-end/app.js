const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(userRoutes);
app.use(expenseRoutes);
app.use('/purchase', premiumRoutes);
app.use('/password', passwordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
.sync()
// .sync({force: true})
.then(()=>{
  app.listen(4000);
}
)
.catch(err => {
  console.log(err);
});

