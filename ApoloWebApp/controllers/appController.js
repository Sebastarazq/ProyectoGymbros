import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
//import {Precio, Categoria, Propiedad} from '../models/index.js'
import {Sequelize} from 'sequelize'
import { ClaseProducto, Producto, Usuario } from '../models/index.js'

const inicio = async (req, res) => {

    //VERIFICAR si el usuario tiene una cookie y si la tiene
    // Mostrar el header para usuario autenticado y si no el usuario no autenticado

    const { id } =req.params
    const token = req.cookies._token;
    const usuarioAutenticado = token ? true : false;
    let usuario;

    if (token) {
        // Si el usuario tiene un token, obtenemos su id y buscamos su información en la base de datos
        const idUsuario = jwt.verify(token, process.env.JWT_SECRET).id;
        usuario = await Usuario.findByPk(idUsuario);
    }
    



    res.render('inicio', {
        pagina: 'Inicio',
        usuario,
        csrfToken: req.csrfToken(),
        autenticado: usuarioAutenticado,

    })

}

export {
    inicio
}