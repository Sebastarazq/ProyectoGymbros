import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { ClaseProducto, Producto, Usuario } from '../models/index.js'
import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken'

const admin = async (req,res) => {

    //Leer QueryString

    const { pagina: paginaActual }= req.query

    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/admin-productos?pagina=1')
    }

    try {

        //Limites y Offset para el paginador

        const limit = 6;
        const offset = ((paginaActual*limit) - limit)

        const { id } = req.usuario

        const [productos, total] = await Promise.all([
            await Producto.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                },
                include: [
                    { model: ClaseProducto, as: 'clase_producto'}
                ],
            }),
            Producto.count({
                where: {
                    usuarioId: id
                }
            })
        ])

    const usuario = req.usuario;
    
    res.render('productos/admin', {
        pagina: 'Productos de la Tienda',
        productos,
        usuario,
        csrfToken: req.csrfToken(),
        paginas: Math.ceil(total/limit),
        paginaActual: Number(paginaActual),
        total,
        offset,
        limit
    })
    } catch (error) {
        console.log(error)
    }
}


//Formulario para crear un nuevo producto
const crear =  async (req,res) => {
    //Consultar Modelo de Clase de producto

    const usuario = req.usuario;
    const usuarioAutenticado = true; // Si llegamos hasta aquí es porque el usuario está autenticado

    const [claseProductos]= await Promise.all([
        ClaseProducto.findAll()
    ])

    res.render('productos/crear',{
        pagina: 'Crear Productos',
        csrfToken: req.csrfToken(),
        claseProductos,
        usuario,
        autenticado: usuarioAutenticado,
        datos: {}
    })
}

const guardar =  async (req, res) => {
    // Validacion

    const usuario = req.usuario;
    const usuarioAutenticado = true; // Si llegamos hasta aquí es porque el usuario está autenticado

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        //Consultar Modelo de la clase del producto
        const [claseProductos]= await Promise.all([
            ClaseProducto.findAll()
        ])
        return  res.render ('productos/crear' ,{
            pagina: 'Crear Producto',
            csrfToken: req.csrfToken(),
            claseProductos,
            usuario,
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
    
    const usuario = req.usuario;
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
        producto,
        usuario,
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

const editar = async (req,res) => {

    const { id } =req.params

    const usuario = req.usuario;
    //Validar que el producto exista
    const producto =  await Producto.findByPk(id)

    if(!producto){
        return res.redirect('/admin-productos')
    }
    //Revisar que quein visite la URL, es quien creo el producto
    if(req.usuario.id.toString() !== producto.usuarioId.toString()){
        return res.redirect('/admin-productos')
    }

    //Consultar Modelo de Clase de producto
    const [claseProductos]= await Promise.all([
        ClaseProducto.findAll()
    ])

    res.render ('productos/editar' ,{
        pagina: `Editar Producto: ${producto.nombre}`,
        csrfToken: req.csrfToken(),
        claseProductos,
        usuario,
        datos: producto
    })
}

const guardarCambios = async (req, res) =>{

    //Verificar la validacion
    // Validacion

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        //Consultar Modelo de la clase del producto
        const [claseProductos]= await Promise.all([
            ClaseProducto.findAll()
        ])
    
        return res.render ('productos/editar' ,{
            pagina: `Editar Producto: ${producto.nombre}`,
            csrfToken: req.csrfToken(),
            claseProductos,
            errores: resultado.array(),
            datos: req.body
        })
    }

    //actualizar registro

    const { id } = req.params

    //Validar que el producto exista
    const producto = await Producto.findByPk(id)

    if(!producto){
        return res.redirect('/admin-productos')
    }
    //Revisar que quein visite la URL, es quien creo el producto
    if(req.usuario.id.toString() !== producto.usuarioId.toString()){
        return res.redirect('/admin-productos')
    }


    //Reescribir el objeto y actualizarlo


    try {
        const { nombre, descripcion, precio, cantidad, clase: claseProductoId } = req.body
        producto.set({
            nombre,
            descripcion,
            precio,
            cantidad,
            claseProductoId,
        })

        await producto.save();

        res.redirect('/admin-productos')
        
    } catch (error) {
        console.log(error)
    }
}
const eliminar = async (req, res) =>{

    const { id } = req.params
    

    //Validar que el producto exista
    const producto = await Producto.findByPk(id)

    if(!producto){
        return res.redirect('/admin-productos')
    }
    //Revisar que quein visite la URL, es quien creo el producto
    if(req.usuario.id.toString() !== producto.usuarioId.toString()){
        return res.redirect('/admin-productos')
    }

    //Eliminar la imagen
    await unlink(`public/uploads/${producto.imagen}`)
    console.log(`Se elimino la imagen ${producto.imagen}`)

    //Eliminar el Producto
    await producto.destroy()
    res.redirect('/admin-productos')
}

//Muestra un producto

const mostrarProducto = async (req, res) => {
    const { id } = req.params
    const token = req.cookies._token;
    const usuarioAutenticado = token ? true : false;

    let usuario;

    if (token) {
        // Si el usuario tiene un token, obtenemos su id y buscamos su información en la base de datos
        const idUsuario = jwt.verify(token, process.env.JWT_SECRET).id;
        usuario = await Usuario.findByPk(idUsuario);
    }
  
    try {
      const producto = await Producto.findByPk(id, {
        include: [
          { model: ClaseProducto, as: 'clase_producto' }
        ]
      })
  
      if (!producto || !producto.publicado) {
        return res.redirect('/404')
      }
        // Busca los productos relacionados al producto actual
      const productosRelacionados = await Producto.findAll({
        limit: 3, // Limita a un máximo de 3 productos relacionados
        where: {
          id: { [Sequelize.Op.ne]: producto.id }, // Excluye el producto actual
          publicado: true, // Solo muestra productos publicados
        },
        include: [
          ClaseProducto // Incluye la clase de producto
        ],
        order: [['createdAt', 'DESC']] // Ordena por fecha de creación descendente
      })
  
      res.render('productos/mostrar2', {
        producto,
        productosRelacionados,
        usuario,
        pagina: producto.nombre,
        autenticado: usuarioAutenticado,
        csrfToken: req.csrfToken(),
      })
    } catch (error) {
      console.log(error)
      res.redirect('/404')
    }
  }  

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarProducto
}