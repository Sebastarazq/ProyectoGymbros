import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'


//Crear la app

const app = express()




//Conexion a la base de datos


// Habilitar pug
app.set('view engine','pug') //usar pug
app.set('views','./views') // aca estaran los archivos

// Carpeta publica


//Routing
app.use('/auth', usuarioRoutes)



//Definir un puerto y arrancar el proyecto // Para el correo process.env.PORT ||
const port = 4000;
app.listen(port, () =>{
    console.log(`El servidor de ApoloWebApp esta funcionando en el puerto ${port}`)
});