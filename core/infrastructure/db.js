  
const { Sequelize } = require('sequelize');
const { DATABASE } = require('../../config');


const sequelize = new Sequelize(
    DATABASE.DB,
    DATABASE.USER,
    DATABASE.PASS,
    {
        host: DATABASE.HOST,
        dialect: "mysql"
    }
);

module.exports = sequelize;