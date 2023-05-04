import { exit } from 'node:process'
import claseProductos from "./claseProductos.js";
import usuarios from './usuarios.js';
import tipoUsuarios from './tipoUsuarios.js';
import estadosCitas from './estadoCitas.js';
import tipoCitas from './tipoCitas.js';
import db from "../config/db.js";
import {ClaseProducto, Usuario, TipoUsuario, Cita, EstadoCita, CitaEstadoRegistro, TipoCita} from "../models/index.js"
const importarDatos = async () =>{
    try {
        //Autenticar
        await db.authenticate()
        //Generar las Columnas
        await db.sync()

        //Insertamos los datos

        await Promise.all([
            TipoUsuario.bulkCreate(tipoUsuarios),
            ClaseProducto.bulkCreate(claseProductos),
            //Usuario.bulkCreate(usuarios),
            TipoCita.bulkCreate(tipoCitas),
            EstadoCita.bulkCreate(estadosCitas),
            //Usuario.bulkCreate(usuarios)
        ])
        console.log('Datos importados correctamente')
        exit(0)
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

const eliminarDatos = async () =>{
    try {
        await db.sync({force:true})
        console.log('Datos eliminados correctamente');
        exit(0);
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

 //Importar datos
 if (process.argv[2] === "-i") {
    importarDatos();
    
}

// Eliminar datos
if (process.argv[2] === "-e") {
    eliminarDatos();
    
}