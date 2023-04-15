import { validationResult } from 'express-validator'
import { ClaseProducto, Producto } from '../models/index.js'

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

const guardar =  async (req, res) => {
    // Validacion

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        //Consultar Modelo de la clase del producto
        const [claseProductos]= await Promise.all([
            ClaseProducto.findAll()
        ])
        return  res.render ('productos/crear' ,{
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            claseProductos,
            errores: resultado.array(),
            datos: req.body
        })
    }
    //Crear registro
    const { nombre, descripcion, precio, cantidad, clase: claseProductoId } = req.body

    const { id: usuarioId } = req.usuario

    try {
        const productoGuardado = await Producto.create({
            nombre,
            descripcion,
            precio,
            cantidad,
            claseProductoId,
            usuarioId,
            imagen: ''
        })

        const {id}= productoGuardado

        res.redirect(`/productos/agregar-imagen/${id}`)
        
    } catch (error) {
        console.log(error)
    }
}

const agregarImagen = async (req,res) => {

    const {id} = req.params

    //Validar que el producto exista
    const producto =  await Producto.findByPk(id)

    if(!producto){
        return res.redirect('/admin-productos')
    }

    //validar que el producto no este publicado
    if(producto.publicado){
        return res.redirect('/admin-productos')
    }

    //validar que el producto pertenece a quien visita esta pagina
    if(req.usuario.id.toString() !== producto.usuarioId.toString()){
        return res.redirect('/admin-productos')
    }

    res.render('productos/agregar-imagen', {
        pagina:`Agregar Imagen ${producto.nombre}`, 
        csrfToken: req.csrfToken(),
        producto
    })
}

const almacenarImagen = async (req, res, next) =>{
    const {id} = req.params
    
    //Validar que el producto exista
    const producto =  await Producto.findByPk(id)

    if(!producto){
        return res.redirect('/admin-productos')
    }

    //validar que el producto no este publicado
    if(producto.publicado){
        return res.redirect('/admin-productos')
    }

    //validar que el producto pertenece a quien visita esta pagina
    if(req.usuario.id.toString() !== producto.usuarioId.toString()){
        return res.redirect('/admin-productos')
    }

    try {
        //console.log(req.file)
        //Almacenar la imagen y publicar producto
        producto.imagen = req.file.filename
        producto.publicado = 1
        
        await producto.save()
        
        next()

    } catch (error) {
        console.log(error)
    }

}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen
}