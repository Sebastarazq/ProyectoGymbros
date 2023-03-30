import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from "../models/Usuario.js"
import { generaId } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin= (req,res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
        //csrfToken: req.csrfToken() //opcional para csrf
    })
}

const formularioRegistro= (req,res) => {
    
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
        csrfToken: req.csrfToken()
    })
}
const registrar = async (req,res) =>{
    //Validacion
    await check('nombre').notEmpty().withMessage('El nombre es Obligatorio').run(req)
    await check('apellido').notEmpty().withMessage('El apellido es Obligatorio').run(req)
    await check('email').isEmail().withMessage('No es un email Valido').run(req)
    await check('password').isLength({ min: 6 }).withMessage('Password debe ser de almenos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('La contraseña no coincide').run(req)

    let resultado = validationResult(req)


    //return res.json(resultado.array())
    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(), //opcional para csrf
            errores: resultado.array(),
            usuario:{ 
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email
            }
        })
    }

    //Extraer los datos
    const { nombre, apellido, email, password } = req.body

    //Verificar que el usuario no este duplicado

    const existeUsuario = await Usuario.findOne({ where: { email }})

    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(), //opcional para csrf
            errores: [{msg: 'El usuario ya esta Registrado'}],
            usuario:{ 
                nombre: req.body.nombre,
                email: req.body.email
            }
        })

    }

    //Almacenar usuario
    const usuario = await Usuario.create({
        nombre,
        apellido,
        email,
        password,
        token: generaId()
    })

    // ENVIA EMAIL DE confirmación
    emailRegistro({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        token: usuario.token
    }) 

    //Mostrar mensaje de confirmacion

    res.render('templates/mensaje',{
        pagina: 'Cuenta creada Correctamente',
        mensaje: 'Hemos Enviado un Email de confirmacion, presiona en el enlace'
    })
}
//Funcion que comprueba una cuenta
const confirmar = async (req,res) =>{

    const { token } = req.params;

    //Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: {token}})

    if (!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }


    //Confirmar la cuenta

    usuario.token = null;
    usuario.confirmado= true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmo Correctamente',
    })
}


const formularioOlvidePassword= (req,res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Apolo',
        csrfToken: req.csrfToken(), //opcional para csrf
    })
}

const resetPassword = async (req,res) => {
    //Validacion
    await check('email').isEmail().withMessage('No es un email Valido').run(req)

    let resultado = validationResult(req)


    //return res.json(resultado.array())
    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(), //opcional para csrf
            errores: resultado.array()
        })
    }

    //Buscar el usuario

    const { email } = req.body

    const usuario = await Usuario.findOne({ where: {email}})
    if(!usuario){
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(), //opcional para csrf
            errores: [{msg: 'El email no pertenece a ningun usuario'}]
        })
    }

    //Generar un token y enviar email
    usuario.token = generaId();
    await usuario.save();

    //Enviar email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        token: usuario.token
    })

    //Renderizar un mensaje
    //Mostrar mensaje de confirmacion

    res.render('templates/mensaje',{
        pagina: 'Restablece tu password',
        mensaje: 'Hemos Enviado un Email con las instrucciones'
    })
}
const comprobarToken = async (req, res) =>{

    const{ token } = req.params;

    const usuario = await Usuario.findOne({ where: {token}})
    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'restablece tu password',
            mensaje: 'Hubo un error al valdiar tu informacion, intenta de nuevo',
            error: true
        })
    }

    // Mostrar formulario para modificar password
    res.render('auth/reset-password',{
        pagina: 'Restablece tu Password',
        csrfToken: req.csrfToken()
    })

    
    
}
const nuevoPassword = async (req, res) =>{
    //Validar password
    await check('password').isLength({ min: 6 }).withMessage('Password debe ser de almenos 6 caracteres').run(req)

    let resultado = validationResult(req)

    //return res.json(resultado.array())
    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/reset-password', {
            pagina: 'Restablece tu password',
            csrfToken: req.csrfToken(), //opcional para csrf
            errores: resultado.array()
        })
    }

    const { token } = req.params
    const { password } = req.body;
    //Quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}})

    //Hashear
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash( password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina: 'Password Restablecido',
        mensaje: 'El password se guardo correctamente'
    })

}
export {
    formularioLogin,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}