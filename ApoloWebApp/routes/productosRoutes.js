import express from "express";
import{ body } from 'express-validator'
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios,
eliminar, mostrarProducto } from '../controllers/productosController.js'
import protegerRuta from "../middleware/protegerRuta.js"
import esTrabajador from "../middleware/tipoUsuario.js";
import upload from "../middleware/subirImagen.js"

const router = express.Router()

router.get('/admin-productos',protegerRuta, esTrabajador, admin)
router.get('/productos/crear',protegerRuta, crear)
router.post('/productos/crear',
protegerRuta,
esTrabajador,
body('nombre').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
body('descripcion')
.notEmpty().withMessage('La descripcion no puede ir vacia')
.isLength({ max:700 }).withMessage('La descripcion es muy larga'),
body('precio').notEmpty().withMessage('El Precio es obligatorio'),
body('cantidad').notEmpty().withMessage('La cantidad es obligatorio'),
body('clase').isNumeric().withMessage('Selecciona una clase'),    
guardar
)

router.get('/productos/agregar-imagen/:id',
protegerRuta,
esTrabajador,
agregarImagen
)

router.post('/productos/agregar-imagen/:id', 
    protegerRuta,
    esTrabajador,
    upload.single('imagen'),
    almacenarImagen
)

router.get('/productos/editar/:id', 
    protegerRuta,
    esTrabajador,
    editar
)

router.post('/productos/editar/:id',
protegerRuta,
esTrabajador,
body('nombre').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
body('descripcion')
.notEmpty().withMessage('La descripcion no puede ir vacia')
.isLength({ max:700 }).withMessage('La descripcion es muy larga'),
body('precio').notEmpty().withMessage('El Precio es obligatorio'),
body('cantidad').notEmpty().withMessage('La cantidad es obligatorio'),
body('clase').isNumeric().withMessage('Selecciona una clase'),    
guardarCambios
)

router.post('/productos/eliminar/:id',
    protegerRuta,
    esTrabajador,
    eliminar
)

//Area publica
router.get('/producto/:id',
    //identificarUsuario,
    mostrarProducto
)


export default router;