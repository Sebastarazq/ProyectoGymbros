import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
//import {Precio, Categoria, Propiedad} from '../models/index.js'
import {Sequelize} from 'sequelize'
import { ClaseProducto, Producto, Usuario } from '../models/index.js'

const inicio = async (req, res) => {

    //VERIFICAR si el usuario tiene una cookie y si la tiene
    // Mostrar el header para usuario autenticado y si no el usuario no autenticado

    const { id } =req.params
    const token = req.cookies._token;
    const usuarioAutenticado = token ? true : false;
    let usuario;

    if (token) {
        // Si el usuario tiene un token, obtenemos su id y buscamos su información en la base de datos
        const idUsuario = jwt.verify(token, process.env.JWT_SECRET).id;
        usuario = await Usuario.findByPk(idUsuario);
    }
    



    res.render('inicio', {
        pagina: 'Inicio',
        usuario,
        csrfToken: req.csrfToken(),
        autenticado: usuarioAutenticado,

    })

}

const terminos = (req,res) =>{
  res.render('tyc', {
    pagina: 'Terminos y condiciones',
    csrfToken: req.csrfToken(),

})

}
const tratados = (req,res) =>{
  res.render('tratados', {
    pagina: 'Política de privacidad y Tratamiento de datos',
    csrfToken: req.csrfToken(),

})

}

const todoproductos = async (req, res) => {
  const token = req.cookies._token;
  const usuarioAutenticado = token ? true : false;
  let usuario;

  if (token) {
    const idUsuario = jwt.verify(token, process.env.JWT_SECRET).id;
    usuario = await Usuario.findByPk(idUsuario);
  }

  const limit = 8; // número máximo de elementos a recuperar
  const expresion = /^[1-9]+[0-9]*$/; // Expresión regular para aceptar solo números enteros positivos
  const paginaActual = req.query.page;
  let page = 1;

  if (paginaActual && expresion.test(paginaActual)) {
    page = parseInt(paginaActual);
  } else {
    return res.redirect(`/productos?page=1`);
  }

  const offset = (page - 1) * limit; // determina el punto de inicio para recuperar elementos
  const productos = await Producto.findAndCountAll({
    limit,
    offset,
    order: [['nombre', 'ASC']],
    include: [
      {
        model: ClaseProducto,
        as: 'clase_producto',
        attributes: ['id','nombre'],
        required: true
      }
    ]
  });

  // Aquí obtenemos todas las clases de productos
  const todasLasClases = await ClaseProducto.findAll({attributes: ['nombre', 'id']});

  // Aquí filtramos las clases de productos distintas
  const clasesProductosDistintas = [...new Set(productos.rows.map(producto => producto.clase_producto.nombre))];

  // Aquí creamos un array con las primeras 5 clases de productos
  const primerasCincoClases = await ClaseProducto.findAll({
  attributes: ['id','nombre'],
  limit: 5,
  });



  const pages = Math.ceil(productos.count / limit); // número total de páginas
  const isFirstPage = page === 1;
  const isLastPage = page === pages;

  // Aquí renderizamos la vista 'productos/productos' con los datos necesarios
  res.render('productos/productos', {
    pagina: 'Productos',
    usuario,
    productos,
    primerasCincoClases,
    todasLasClases: todasLasClases.slice(5), // Desplegamos el menú con las demás clases a partir de la sexta
    csrfToken: req.csrfToken(),
    autenticado: usuarioAutenticado,
    isFirstPage,
    isLastPage,
    currentPage: page,
    pages,
  });
};

const categoria = async (req, res) => {

  const token = req.cookies._token;
  const usuarioAutenticado = token ? true : false;
  let usuario;

  if (token) {
    const idUsuario = jwt.verify(token, process.env.JWT_SECRET).id;
    usuario = await Usuario.findByPk(idUsuario);
  }
  const { id } = req.params;

  // Comprobar que la categoría exista
  const claseProducto = await ClaseProducto.findByPk(id);
  if (!claseProducto) {
    return res.redirect('/404');
  }

  // Obtener los productos de la clase de producto
  const limit = 8; // número máximo de elementos a recuperar
  const expresion = /^[1-9]+[0-9]*$/; // Expresión regular para aceptar solo números enteros positivos
  const paginaActual = req.query.page;
  let page = 1;

  if (paginaActual && expresion.test(paginaActual)) {
    page = parseInt(paginaActual);
  } else {
    return res.redirect(`/productos/categorias/${id}?page=1`);
  }

  const offset = (page - 1) * limit; // determina el punto de inicio para recuperar elementos

  const productos = await Producto.findAndCountAll({
    where: {
      claseProductoId: id,
    },
    limit,
    offset,
    order: [['nombre', 'ASC']],
    include: [
      {
        model: ClaseProducto,
        as: 'clase_producto',
        attributes: ['id', 'nombre'],
        required: true,
      },
    ],
  });

  // Aquí obtenemos todas las clases de productos
  const todasLasClases = await ClaseProducto.findAll({
    attributes: ['nombre', 'id'],
  });

  // Aquí filtramos las clases de productos distintas
  const clasesProductosDistintas = [
    ...new Set(productos.rows.map((producto) => producto.clase_producto.nombre)),
  ];

  // Aquí creamos un array con las primeras 5 clases de productos
  const primerasCincoClases = await ClaseProducto.findAll({
    attributes: ['id', 'nombre'],
    limit: 5,
  });

  const pages = Math.ceil(productos.count / limit); // número total de páginas
  const isFirstPage = page === 1;
  const isLastPage = page === pages;

  // Aquí renderizamos la vista 'productos/productos' con los datos necesarios
  res.render('productos/categorias', {
    pagina: claseProducto.nombre,
    usuario,
    productos,
    primerasCincoClases,
    todasLasClases: todasLasClases.slice(5), // Desplegamos el menú con las demás clases a partir de la sexta
    csrfToken: req.csrfToken(),
    autenticado: usuarioAutenticado,
    isFirstPage,
    isLastPage,
    currentPage: page,
    pages,
  });
};

const noEncontrado = async (req,res) => {

    const token = req.cookies._token;
    const usuarioAutenticado = token ? true : false;
    let usuario;

    if (token) {
        // Si el usuario tiene un token, obtenemos su id y buscamos su información en la base de datos
        const idUsuario = jwt.verify(token, process.env.JWT_SECRET).id;
        usuario = await Usuario.findByPk(idUsuario);
    }

    res.render('auth/404',{
        pagina: 'No encontrada',
        usuario,
        autenticado: usuarioAutenticado,
        csrfToken: req.csrfToken(),
    })
}
const mostrarBusqueda = async (req, res) => {
  const token = req.cookies._token;
  const usuarioAutenticado = token ? true : false;
  let usuario;

  if (token) {
    // Si el usuario tiene un token, obtenemos su id y buscamos su información en la base de datos
    const idUsuario = jwt.verify(token, process.env.JWT_SECRET).id;
    usuario = await Usuario.findByPk(idUsuario);
  }

  // Obtener los productos de la clase de producto
  const limit = 8; // número máximo de elementos a recuperar
  //const { termino } = req.body;

  //Validar que termino no esté vacío
  /* if (!termino.trim()) {
    return res.redirect('back');
  } */

  //CONSULTAR productos
  const productos = await Producto.findAndCountAll({
    limit,
    order: [['nombre', 'ASC']],
    include: [
      {
        model: ClaseProducto,
        as: 'clase_producto',
        attributes: ['id','nombre'],
        required: true
      }
    ]
  });
  // Aquí obtenemos todas las clases de productos
  const todasLasClases = await ClaseProducto.findAll({
    attributes: ['nombre', 'id']
  });

  // Aquí creamos un array con las primeras 5 clases de productos
  const primerasCincoClases = await ClaseProducto.findAll({
    attributes: ['id', 'nombre'],
    limit: 5
  });

  //console.log(productos);

  res.render('busqueda', {
    pagina: 'Buscar productos',
    productos,
    usuario,
    primerasCincoClases,
    todasLasClases: todasLasClases.slice(5), // Desplegamos el menú con las demás clases a partir de la sexta
    csrfToken: req.csrfToken(),
    autenticado: usuarioAutenticado
  });
};


const buscador = async (req, res) => {
  const token = req.cookies._token;
  const usuarioAutenticado = token ? true : false;
  let usuario;

  if (token) {
    // Si el usuario tiene un token, obtenemos su id y buscamos su información en la base de datos
    const idUsuario = jwt.verify(token, process.env.JWT_SECRET).id;
    usuario = await Usuario.findByPk(idUsuario);
  }

  // Obtener los productos de la clase de producto
  const limit = 8; // número máximo de elementos a recuperar
  const { termino } = req.body;

  //Validar que termino no esté vacío
  if (!termino.trim()) {
    return res.redirect('back');
  }

  //CONSULTAR productos
  const productos = await Producto.findAndCountAll({
    limit,
    order: [['nombre', 'ASC']],
    where: {
      [Sequelize.Op.or]: [
        {
          nombre: {
            [Sequelize.Op.like]: '%' + termino + '%'
          }
        },
        {
          '$clase_producto.nombre$': {
            [Sequelize.Op.like]: '%' + termino + '%'
          }
        }
      ]
    },
    include: [
      {
        model: ClaseProducto,
        as: 'clase_producto',
        attributes: ['id', 'nombre']
      },
    ]
  });

  // Aquí obtenemos todas las clases de productos
  const todasLasClases = await ClaseProducto.findAll({
    attributes: ['nombre', 'id']
  });

  // Aquí creamos un array con las primeras 5 clases de productos
  const primerasCincoClases = await ClaseProducto.findAll({
    attributes: ['id', 'nombre'],
    limit: 5
  });

  console.log(termino);
  //console.log(productos);

  res.render('busqueda', {
    pagina: 'Resultados de la Busqueda',
    productos,
    usuario,
    primerasCincoClases,
    todasLasClases: todasLasClases.slice(5), // Desplegamos el menú con las demás clases a partir de la sexta
    csrfToken: req.csrfToken(),
    autenticado: usuarioAutenticado
  });
};


export {
    inicio,
    terminos,
    tratados,
    todoproductos,
    categoria,
    noEncontrado,
    mostrarBusqueda,
    buscador,
}