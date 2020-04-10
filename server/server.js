require('./config/config')

const express = require('express')
const mongoose = require('mongoose')

const app = express()
const bodyParser = require('body-parser')

// parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse aplication/json
app.use(bodyParser.json())

app.use(require('./rutas/usuario'))

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) throw err

        console.log('Base de Datos ONLINE');

    })

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
})