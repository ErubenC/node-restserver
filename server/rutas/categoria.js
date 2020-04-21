const express = require('express')

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

const app = express()

const Categoria = require('../modelos/categoria')

//============================
//Mostrar todas las categorias
//============================
app.get('/categoria', verificaToken, (req, res) => {


    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            })

        })


})


//============================
//Mostrar una categoria por ID
//============================
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })


})


//============================
//Crear una categoria
//============================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body

    let categoria = new Categoria({

        descripcion: body.descripcion,
        usuario: req.usuario._id

    })

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})

//===============================
//Actualizar una categoria por ID
//===============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = req.body

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        categoriaDB.descripcion = body.descripcion;

        categoriaDB.save((err, categoriaActu) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaActu
            });

        })

    })


    /********************************************************
     * Obsoleto

        let descCategoria = {
            descripcion: body.descripcion
        }

        Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            })

        })
    */

})


//============================
//Borrar una categoria por ID
//============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    //Solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove
    let id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })

    })

})


module.exports = app