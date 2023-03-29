import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js';


//Crear la app

const app = express()

//Conexion a la base de datos
try{
    await db.authenticate();
    db.sync()
    console.log('Conexión Correcta a la Base de Datos de ApoloWebApp')
} catch(error){
    console.log(error)
}

// Habilitar pug
app.set('view engine','pug') //usar pug
app.set('views','./views') // aca estaran los archivos

// Carpeta publica
app.use(express.static('public'))


//Routing
app.use('/auth', usuarioRoutes)



//Definir un puerto y arrancar el proyecto // Para el correo process.env.PORT ||
const port = 4000;
app.listen(port, () =>{
    console.log(`El servidor de ApoloWebApp esta funcionando en el puerto ${port}`)
});