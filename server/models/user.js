const Sequelize = require('sequelize'); //this will import a class or constructor function and hence we've used capital 'S'.
const sequelize = require('../util/database');

const User = sequelize.define('expenses', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  expenseamount: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = User;