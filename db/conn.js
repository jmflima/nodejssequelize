const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('nodesequelize', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})

// try{
//     sequelize.authenticate()
//     console.log("Conexão com o Sequelize efetuada com sucesso..")
// }catch(err){
//     console.log('Não foi possível conectar o banco: ', err)
// }

module.exports = sequelize

