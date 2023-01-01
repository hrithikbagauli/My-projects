const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expense = sequelize.define('expense', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  amount:{
    type: Sequelize.DOUBLE,
  },
  category:{
    type: Sequelize.STRING,
  },
  img_src:{
    type: Sequelize.STRING
  }
});

module.exports = Expense;
