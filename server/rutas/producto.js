const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

let app = express()

const Producto = require('../modelos/producto')

// =============================
// Listar todos lod producto
// =============================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    //let estadoReq = req.query.estado

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })

        })



})


// =============================
// Listar un producto por ID
// =============================
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })

})


// =============================
// Grabar un producto
// =============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })


        })

})


// =============================
// Grabar un producto
// =============================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body

    let producto = new Producto({

        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    })


    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })
})


app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = req.body

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: 'El Id no exiuste'
            })
        }

        productoDB.nombre = body.nombre
        productoDB.precioUni = body.precioUni
        productoDB.categoria = body.categoria
        productoDB.disponible = body.disponible
        productoDB.descripcion = body.descripcion

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({

                ok: true,
                producto: productoGuardado

            })

        })

    })


})


app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = req.body

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productoDB.disponible = body.disponible;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });

        })

    })


})

module.exports = app