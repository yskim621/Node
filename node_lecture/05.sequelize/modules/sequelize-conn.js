const { Sequelize, Model } = require('sequelize')

const connect = {
	host: 'localhost',
	port: 3306,
	dialect: 'mysql',
	database: 'karl',
	username: 'root',
	password: '1410517yoonseok',
	pool: {
		max: 10
	}
}
const sequelize = new Sequelize(connect)

module.exports = { Sequelize, Model, sequelize }