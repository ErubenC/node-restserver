const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema

let categoriaSchema = new Schema({

    descripcion: {
        type: String,
        unique: true,
        required: [true, 'Descripcion es necesario']
    },
    usuario: {
        type: String
    }

})

module.exports = mongoose.model('Categoria', categoriaSchema)