import { exit } from 'node:process'
import claseProductos from "./claseProductos.js";
import ClaseProducto from "../models/ClaseProducto.js";
import db from "../config/db.js";

const importarDatos = async () =>{
    try {
        //Autenticar
        await db.authenticate()
        //Generar las Columnas
        await db.sync()

        //Insertamos los datos

        await Promise.all([
            ClaseProducto.bulkCreate(claseProductos)
            //Precio.bulkCreate(precios),
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