import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'


//Crear la app

const app = express()




//Conexion a la base de datos


// Carpeta publica


//Routing
app.use('/auth', usuarioRoutes)



//Definir un puerto y arrancar el proyecto // Para el correo process.env.PORT ||
const port = 4000;
app.listen(port, () =>{
    console.log(`El servidor de ApoloWebApp esta funcionando en el puerto ${port}`)
});