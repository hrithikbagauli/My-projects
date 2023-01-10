const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Download = sequelize.define('download', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
  },
  url: {
    type: Sequelize.STRING,
  }
});

module.exports = Download;
