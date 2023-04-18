import express from "express";
import { inicio, todoproductos, categoria, noEncontrado, buscador } from '../controllers/appController.js'

const router = express.Router()

//Pagina de inicio

router.get('/',inicio)

//Productos
router.get('/productos', todoproductos)

//Categorias
router.get('productos/categorias/:id', categoria)


//Pagina 404
router.get('/404', noEncontrado)

//Buscador
router.post('productos/buscador', buscador)


export default router;