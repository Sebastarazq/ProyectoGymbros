import express from "express";
import{ body } from 'express-validator'
import { admin, crear, guardar, agregarImagen, almacenarImagen } from '../controllers/productosController.js'
import protegerRuta from "../middleware/protegerRuta.js"
import upload from "../middleware/subirImagen.js"

const router = express.Router()

router.get('/admin-productos',protegerRuta, admin)
router.get('/productos/crear',protegerRuta, crear)
router.post('/productos/crear',
protegerRuta,
body('nombre').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
body('descripcion')
.notEmpty().withMessage('La descripcion no puede ir vacia')
.isLength({ max:300 }).withMessage('La descripcion es muy larga'),
body('precio').notEmpty().withMessage('El Precio es obligatorio'),
body('cantidad').notEmpty().withMessage('La cantidad es obligatorio'),
body('clase').isNumeric().withMessage('Selecciona una clase'),    
guardar
)

router.get('/productos/agregar-imagen/:id',
protegerRuta, 
agregarImagen
)

router.post('/productos/agregar-imagen/:id', 
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
)



export default router;