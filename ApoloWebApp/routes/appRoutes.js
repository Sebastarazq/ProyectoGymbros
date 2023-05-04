import express from "express";
import { inicio, terminos, tratados, todoproductos, categoria, noEncontrado, buscador, mostrarBusqueda } from '../controllers/appController.js'

const router = express.Router()

//Pagina de inicio

router.get('/',inicio)

//Productos
router.get('/productos', todoproductos)

//Categorias
router.get('/productos/categorias/:id', categoria)


//Pagina 404
router.get('/404', noEncontrado)

//Buscador
router.get('/productos/buscador', mostrarBusqueda);
router.post('/productos/buscador', buscador)

//TYC
router.get('/tyc',terminos)

//Tratados
router.get('/tratados',tratados)

export default router;