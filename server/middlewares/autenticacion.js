const jwt = require('jsonwebtoken')

// =======================
// Verifica token
// =======================

let verificaToken = (req, res, next) => {

    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario
        next()

    })

}

// =======================
// Verifica AdminRole
// =======================

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        return res.json({
            ok: false,
            message: 'El usuario no es Administrador'
        })
    }
}

// =======================
// Verifica AdminRole
// =======================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario
        next()

    })
}


module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}