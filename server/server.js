require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
const bodyParser = require('body-parser')

// parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse aplication/json
app.use(bodyParser.json())

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

// Configuracion global de rutas
app.use(require('./rutas/index'))

mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (err, res) => {

        if (err) throw err

        console.log('Base de Datos ONLINE');

    })

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
})