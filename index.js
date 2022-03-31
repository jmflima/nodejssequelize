const express = require("express")
const exphbs = require("express-handlebars");
const { on } = require("nodemon");
const conn = require('./db/conn');

const User = require("./models/User"); //importando o modelo
const Endereco = require("./models/Endereco")

//const user = require('./models/User')

const app = express();

app.use(
    express.urlencoded({
        extended: true,
    }),
)
app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', "handlebars")

app.use(express.static('public'))

app.get('/users/create', (req, res) => {
    res.render('adduser')
})

app.post('/users/create', async (req, res) => {
    const name = req.body.nome
    const occupation = req.body.ocupacao
    let newsletter = req.body.noticia

    if(newsletter === 'on'){
        newsletter = true
    }else{
        newsletter = false
    }
//    console.log(req.bady)
    await User.create({name, occupation, newsletter})

    res.redirect('/')
})

/*Pequisa um registro para mostrar detalhes*/
app.get('/users/detalhe/:id', async (req, res) => {
    const id = req.params.id

    const retorno = await User.findOne({raw: true, where: { id: id } })

    res.render('userview', { retorno })
})

/* Pesquisa registro para exclusão */
app.post('/users/delete/:id', async (req, res) => {
    const id = req.params.id

    await User.destroy({ where: { id: id } })

    res.redirect('/')
})

/*Pequisa um registro para edição*/
app.get('/users/edit/:id', async (req, res) => {
    const id = req.params.id

    try {
        const user = await User.findOne({include: Endereco, where: { id: id } })

        res.render('useredit', { user: user.get({ plain: true}) })
    } catch (err){ 
        console.log(`Este é o erro: ${err}`)
    }

})

app.post('/users/update', async (req, res) => {
    const id = req.body.id
    const name = req.body.nome
    const occupation = req.body.ocupacao
    let newsletter = req.body.noticia

    if(newsletter === 'on'){
        newsletter = true
    }else{
        newsletter = false
    }  
    
    const dados = {
         id,
         name,
         occupation,
         newsletter
    }
    await User.update( dados, {where: { id: id } })

    res.redirect('/')

})

app.get('/', async (req, res) => {

    const user = await User.findAll({raw: true})

//    console.log(user)

    res.render('home', { usuario: user} )
})

// criando endereço de um determinado usuário
app.post('/address/create', async (req, res) => {
    const UserId = req.body.UserId
    const street = req.body.street
    const number = req.body.number
    const city = req.body.city

    const address = {
        UserId,
        street,
        number,
        city,
    } 
    await Endereco.create( address )

    res.redirect(`/users/edit/${UserId}`)

})

app.post('/address/delete', async (req, res) => {
    const UserId = req.body.UserId //id do usuário na tabela de endereço
    const id = req.body.id

    await Endereco.destroy( { where: {id: id} })

    res.redirect(`/users/edit/${UserId}`)
})

/*Pequisa um registro na tabela de endereço para para ser editado*/
app.get('/address/edit/:id', async (req, res) => {
    const id = req.params.id

    const retorno = await Endereco.findOne({raw: true, where: { id: id } })

    res.render('addressedit', { retorno })
})

app.post('/address/update', async (req, res) => {
    const UserId = req.body.UserId
    const id = req.body.id
    const street = req.body.street
    const number = req.body.number
    const city = req.body.city

    const address = {
        id,
        street,
        number,
        city,
    } 
    
    await Endereco.update( address, {where: { id: id } })

    res.redirect(`/users/edit/${UserId}`)

})

conn
    .sync()
//    .sync( {force: true} ) //recria todas as tabelas
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(err))

