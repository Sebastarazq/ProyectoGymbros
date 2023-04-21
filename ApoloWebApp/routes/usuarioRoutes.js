import express from "express";
import protegerRuta from "../middleware/protegerRuta.js";
import { formularioLogin, autenticar, cerrarSesion, formularioRegistro, formularioOlvidePassword, registrar,
confirmar, resetPassword, comprobarToken, nuevoPassword, editarPerfil, guardarCambios } from '../controllers/usuarioController.js'

const router = express.Router();

// Routing
router.get('/login', formularioLogin);
router.post('/login', autenticar);

//Cerrar Sesion
router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)


router.get('/confirmar/:token', confirmar)

router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', resetPassword)

//Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

//editar perfil
router.get('/mi-perfil/:id',protegerRuta, editarPerfil)
router.post('/mi-perfil/:id',protegerRuta, guardarCambios)










export default router