import express from 'express'
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js'
import productosRoutes from './routes/productosRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import citasRoutes from './routes/citasRoutes.js'
import db from './config/db.js';


//Crear la app

const app = express()

//Habilitar lectura de datos de formularios
app.use( express.urlencoded({extended: true}))


//Hablitar Cookie Parser
app.use( cookieParser())

//Hablitar CSRF
app.use( csurf({cookie: true}) )

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
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', productosRoutes)
app.use('/', apiRoutes)
app.use('/', citasRoutes)
// Ruta de manejo de errores para rutas no encontradas
// Ruta de manejo de errores para rutas no encontradas
/* app.use((req, res) => {
    res.redirect('/404');
}); */
  


//Definir un puerto y arrancar el proyecto // Para el correo process.env.PORT
const port = 4000;
app.listen(process.env.PORT || port, () =>{
    console.log(`El servidor de ApoloWebApp esta funcionando en el puerto ${port}`)
});