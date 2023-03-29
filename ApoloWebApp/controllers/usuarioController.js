import { check, validationResult } from 'express-validator'

const formularioLogin= (req,res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
        //csrfToken: req.csrfToken() //opcional para csrf
    })
}

const formularioRegistro= (req,res) => {
    
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
        //csrfToken: req.csrfToken() //opcional para csrf
    })
}

const formularioOlvidePassword= (req,res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        //csrfToken: req.csrfToken(), //opcional para csrf
    })
}


export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
}