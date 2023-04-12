import { body } from 'express-validator'
//import {Precio, Categoria, Propiedad} from '../models/index.js'
import {Sequelize} from 'sequelize'

const inicio = async (req, res) => {
    res.render('inicio', {
        pagina: 'Inicio',
        csrfToken: req.csrfToken()
    })

}

export {
    inicio
}