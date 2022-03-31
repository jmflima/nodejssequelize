const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const User = require('./User')

const Endereco = db.define('Endereco', {
    street: {
        type: DataTypes.STRING,
        require:true
    },
    number: {
        type: DataTypes.STRING,
        require:true
    },
    city: {
        type: DataTypes.STRING,
        require:true
    }
})

User.hasMany(Endereco)
Endereco.belongsTo(User)

module.exports = Endereco


