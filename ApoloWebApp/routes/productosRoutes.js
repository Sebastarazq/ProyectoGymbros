import express from "express";
import { admin, crear } from '../controllers/productosController.js'

const router = express.Router()

router.get('/admin-productos',admin)
router.get('/productos/crear', crear)



export default router;