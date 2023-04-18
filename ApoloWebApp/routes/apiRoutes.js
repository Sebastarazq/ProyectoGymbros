import express from 'express'
import{ productos } from '../controllers/apiController.js'

const router = express.Router()


router.get('/jsonproductos', productos)

export default router