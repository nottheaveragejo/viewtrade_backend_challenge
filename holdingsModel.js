const Sequelize = require('sequelize')
const db = require('./db')

const Holdings = db.define('holdings', {
  name:{
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  ticker: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  sector: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  weight: {
    type: Sequelize.FLOAT, // NL: Price value will be stored in cents, not dollars.
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 0
    }
  }
})
module.exports = Holdings
