import ClaseProducto from "../models/ClaseProducto.js"

const admin = (req,res) => {
    res.render('productos/admin', {
        pagina: 'Productos de la Tienda'
    })
}


//Formulario para crear un nuevo producto
const crear =  async (req,res) => {
    //Consultar Modelo de Clase de producto
    const [claseProductos]= await Promise.all([
        ClaseProducto.findAll()
    ])

    res.render('productos/crear',{
        pagina: 'Crear Productos',
        csrfToken: req.csrfToken(),
        claseProductos,
        datos: {}
    })
}

export {
    admin,
    crear
}