import express from "express";
import protegerRuta from "../middleware/protegerRuta.js";
import esTrabajador from "../middleware/tipoUsuario.js";
import {
  mostrarFormularioCrearCita, crearCita, mostrarFormularioEditarCita, actualizarCita,
  eliminarCita, mostrarTodasLasCitas, citas, asignarCita
} from "../controllers/citasController.js";

const router = express.Router();

// Mostrar todas las citas panel admin
router.get("/admin-citas", protegerRuta, esTrabajador, mostrarTodasLasCitas);

// Mostrar formulario para crear cita
router.get("/crear-cita", protegerRuta, esTrabajador, mostrarFormularioCrearCita);

// Crear nueva cita
router.post("/crear-cita", protegerRuta, esTrabajador, crearCita);

// Mostrar formulario para editar cita
router.get("/cita/editar/:id", protegerRuta, esTrabajador, mostrarFormularioEditarCita);

// Actualizar cita existente
router.post("/cita/editar/:id", protegerRuta, esTrabajador, actualizarCita);

// Eliminar cita existente
router.post("/cita/eliminar/:id", protegerRuta, esTrabajador, eliminarCita);

// Mostrar todas las citas
router.get("/citas", protegerRuta, citas)

// Solicitar la cita
router.post("/citas", protegerRuta, asignarCita)



export default router;
